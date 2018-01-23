import React from 'react';
import apiClient from 'panoptes-client/lib/api-client.js';
import counterpart from 'counterpart';
import { getSessionID } from '../lib/get-session-id';
import { Split } from 'seven-ten';

import { setAnnotations } from './annotations';
import { fetchSubject, fetchSavedSubject, addAlreadySeen } from './subject';
import { resetView } from './subject-viewer';
import { toggleDialog } from './dialog';
import SaveSuccess from '../components/SaveSuccess';

//Action Types
const SUBMIT_CLASSIFICATION = 'SUBMIT_CLASSIFICATION';
const SUBMIT_CLASSIFICATION_SUCCESS = 'SUBMIT_CLASSIFICATION_SUCCESS';
const SUBMIT_CLASSIFICATION_ERROR = 'SUBMIT_CLASSIFICATION_ERROR';
const CREATE_CLASSIFICATION = 'CREATE_CLASSIFICATION';
const CREATE_CLASSIFICATION_ERROR = 'CREATE_CLASSIFICATION_ERROR';
const SET_SUBJECT_COMPLETION_ANSWERS = 'SET_SUBJECT_COMPLETION_ANSWERS';
const UPDATE_CLASSIFICATION = 'UPDATE_CLASSIFICATION';

const CLASSIFICATION_STATUS = {
  IDLE: 'classification_status_idle',
  SENDING: 'classification_status_sending',
  SUCCESS: 'classification_status_success',
  ERROR: 'classification_status_error',
};

const initialState = {
  classification: null,
  status: CLASSIFICATION_STATUS.status,
  subjectCompletionAnswers: {},  //Simple Q&A object is structured as {"T2": "thunder", "T7": "cats"}
};

const classificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLASSIFICATION:
      return Object.assign({}, state, {
        classification: action.classification,
        status: CLASSIFICATION_STATUS.IDLE,
        subjectCompletionAnswers: {},
      });

    case CREATE_CLASSIFICATION_ERROR:
      return Object.assign({}, state, {
        status: CLASSIFICATION_STATUS.ERROR
      });

    case SUBMIT_CLASSIFICATION:
      return Object.assign({}, state,{
        status: CLASSIFICATION_STATUS.SENDING,
      });

    //Submitting Classification also resets the store.
    case SUBMIT_CLASSIFICATION_SUCCESS:
      return Object.assign({}, state,{
        classification: null,
        status: CLASSIFICATION_STATUS.SUCCESS,
        subjectCompletionAnswers: {},
      });

    case SUBMIT_CLASSIFICATION_ERROR:
      return Object.assign({}, state,{
        status: CLASSIFICATION_STATUS.ERROR,
      });

    case SET_SUBJECT_COMPLETION_ANSWERS:
      const sca = Object.assign({}, state.subjectCompletionAnswers);
      sca[action.taskId] = action.answerValue;
      return Object.assign({}, state, {
        subjectCompletionAnswers: sca,
      });

    case UPDATE_CLASSIFICATION:  //Useful when the Classification object is changed, and we need to get a 'fresh one' from Panoptes.
      return Object.assign({}, state, {
        classification: action.classification,
      });

    default:
      return state;
  }
};

const createClassification = () => {
  return (dispatch, getState) => {
    let workflow_version = '';
    if (getState().workflow.data) {
      workflow_version = getState().workflow.data.version;
    }

    const classification = apiClient.type('classifications').create({
      annotations: [],
      metadata: {
        workflow_version,
        started_at: (new Date).toISOString(),
        user_agent: navigator.userAgent,
        user_language: counterpart.getLocale(),
        utc_offset: ((new Date).getTimezoneOffset() * 60).toString(),
        subject_dimensions: [],
      },
      links: {
        project: getState().project.id,
        workflow: getState().workflow.id,
        subjects: [getState().subject.id]
      }
    });
    classification._workflow = getState().workflow.data;
    classification._subjects = [getState().subject.currentSubject];

    const isGS = getState().workflow.goldStandardMode;
    if (isGS) {
      classification.update({ gold_standard: true });
    }

    dispatch({
      type: CREATE_CLASSIFICATION,
      classification
    });
  };
};

const submitClassification = () => {
  return (dispatch, getState) => {
    //Initialise
    //----------------
    const subject = getState().subject;
    const subject_dimensions = (subject && subject.imageMetadata) ? subject.imageMetadata : [];
    const classification = getState().classifications.classification;
    const updatedAnnotations = [];  //Always start empty (don't pull anything from classification.annotation) the build the array based on the answers we have.
    const user = getState().login.user;

    //TODO: Better error handling
    if (!classification) { alert('ERROR: Could not submit Classification.'); return; }
    //----------------

    //Record the first task
    //This is implicitly the 'transcription' task.
    //----------------
    let task = "T0";
    if (getState().workflow.data) {
      task = getState().workflow.data.first_task;  //This should usually be T1.
    }
    const firstTaskAnnotations = {
      _key: Math.random(),
      _toolIndex: 0,
      task,
      value: getState().annotations.annotations,
    };
    updatedAnnotations.push(firstTaskAnnotations);
    //----------------

    //Record the other tasks.
    //Note that each annotation in classification.annotations[] is in the form
    //of: { task: "T1", value: 123 || "abc" || ['a','b'] }
    //----------------
    const sca = getState().classifications.subjectCompletionAnswers;
    Object.keys(sca).map((taskId) => {
      const answerForTask = {
        task: taskId,
        value: sca[taskId],
      };
      updatedAnnotations.push(answerForTask);
    });
    //----------------

    //Save the classification
    //----------------
    dispatch({ type: SUBMIT_CLASSIFICATION });
    classification.update({
      annotations: updatedAnnotations,
      completed: true,
      'metadata.session': getSessionID(),
      'metadata.finished_at': (new Date()).toISOString(),
      'metadata.viewport': {
        width: innerWidth,
        height: innerHeight,
      },
      'metadata.subject_dimensions': subject_dimensions || [],
    })
      .save()

      //Successful save: reset everything, then get the next Subject.
      .then(() => {
        if (user) {
          localStorage.removeItem(`${user.id}.classificationID`);
        }
        //Log
        console.log('Submit classification: Success');
        try {  //Fix: IE11 doesn't know what to do with Split.classificationCreated()
          Split.classificationCreated(classification);
        } catch (err) { console.error('Split.classificationCreated() error: ', err); }

        //Reset values in preparation for the next Subject.
        dispatch({ type: SUBMIT_CLASSIFICATION_SUCCESS });
        dispatch(fetchSubject());  //Note: fetching a Subject will also reset Annotations, reset Previous Annotations, and create an empty Classification.
        dispatch(resetView());
      })

      //Unsuccessful save
      .catch((err) => {
        //TODO: Proper error handling
        console.error('ducks/classifications.js submitClassification() error: ', err);
        Rollbar && Rollbar.error &&
        Rollbar.error('ducks/classifications.js submitClassification() error: ', err);
        alert('ERROR: Could not submit Classification');
        dispatch({ type: SUBMIT_CLASSIFICATION_ERROR });
      });
    //----------------

    const { workflow, subjects } = classification.links;
    dispatch(addAlreadySeen(workflow, subjects));
  };
};

const setSubjectCompletionAnswers = (taskId, answerValue) => {
  return (dispatch) => {
    dispatch({
      type: SET_SUBJECT_COMPLETION_ANSWERS,
      taskId, answerValue,
    });
  };
};

const retrieveClassification = (id) => {
  return (dispatch) => {
    apiClient.type('classifications/incomplete').get({ id })
      .then(([classification]) => {
        //TODO: Test if classification.annotations.shift() is OK; normally we don't update the classification object directly.
        const subjectId = classification.links.subjects.shift();
        const annotations = classification.annotations.shift();
        dispatch(setAnnotations(annotations.value));
        dispatch(fetchSavedSubject(subjectId));
        dispatch({
          type: CREATE_CLASSIFICATION,
          classification,
          status: CLASSIFICATION_STATUS.IDLE,
          subjectCompletionAnswers: {},
        });
      })
      .catch((err) => {
        console.error('ducks/classifications.js retrieveClassification() error: ', err);
        Rollbar && Rollbar.error &&
        Rollbar.error('ducks/classifications.js retrieveClassification() error: ', err);
        dispatch({
          type: CREATE_CLASSIFICATION_ERROR
        })
      });
  };
};

const saveClassificationInProgress = () => {
  return (dispatch, getState) => {
    let task = "T0";
    if (getState().workflow.data) {
      task = getState().workflow.data.first_task;  //This should usually be T1.
    }
    const user = getState().login.user;

    const annotations = {
      _key: Math.random(),
      _toolIndex: 0,
      task,
      value: getState().annotations.annotations,
    };

    const classification = getState().classifications.classification;

    classification.update({
      annotations: [annotations],
      completed: false,
      'metadata.session': getSessionID(),
      'metadata.finished_at': (new Date()).toISOString(),
    })
    .save()
    .then((savedClassification) => {
      if (user) {
        localStorage.setItem(`${user.id}.classificationID`, savedClassification.id);
      }
      dispatch(toggleDialog(<SaveSuccess />, false, true));

      //Refresh our Classification object with the newer, fresher version from
      //Panoptes. If we don't, all future .save() and .update() actions on the
      //(old) Classification object will start going wonky.
      dispatch({ type: UPDATE_CLASSIFICATION, classification: savedClassification });
    })
    .catch((err) => {
      console.error('ducks/classifications.js saveClassificationInProgress() error: ', err);
      Rollbar && Rollbar.error &&
      Rollbar.error('ducks/classifications.js saveClassificationInProgress() error: ', err);
    });
  };
};

export default classificationReducer;

//------------------------------------------------------------------------------

//Exports

export {
  createClassification,
  submitClassification,
  saveClassificationInProgress,
  retrieveClassification,
  setSubjectCompletionAnswers,
};
