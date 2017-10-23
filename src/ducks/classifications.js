import apiClient from 'panoptes-client/lib/api-client.js';
import counterpart from 'counterpart';
import { getSessionID } from '../lib/get-session-id';
import { Split } from 'seven-ten';

import { resetAnnotations } from './annotations';
import { resetPreviousAnnotations, fetchAnnotations } from './previousAnnotations';
import { fetchSubject } from './subject';
import { resetView } from './subject-viewer';

//Action Types
const SUBMIT_CLASSIFICATION = 'SUBMIT_CLASSIFICATION';
const SUBMIT_CLASSIFICATION_SUCCESS = 'SUBMIT_CLASSIFICATION_SUCCESS';
const SUBMIT_CLASSIFICATION_ERROR = 'SUBMIT_CLASSIFICATION_ERROR';
const CREATE_CLASSIFICATION = 'CREATE_CLASSIFICATION';

const CLASSIFICATION_STATUS = {
  IDLE: 'classification_status_idle',
  SENDING: 'classification_status_sending',
  SUCCESS: 'classification_status_success',
  ERROR: 'classification_status_error',
};

const initialState = {
  classification: null,
  status: CLASSIFICATION_STATUS.status,
};

const classificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLASSIFICATION:
      return Object.assign({}, state, {
        classification: action.classification,
        status: CLASSIFICATION_STATUS.IDLE,
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
      });

    case SUBMIT_CLASSIFICATION_ERROR:
      return Object.assign({}, state,{
        status: CLASSIFICATION_STATUS.ERROR,
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

    dispatch({
      type: CREATE_CLASSIFICATION,
      classification
    });
  };
};

const submitClassification = () => {
  return (dispatch, getState) => {
    let task = "T0";
    if (getState().workflow.data) {
      task = getState().workflow.data.first_task;
    }
    const annotations = {
      _key: Math.random(),
      _toolIndex: 0,
      task: task,
      value: getState().annotations.annotations,
    }

    const subject = getState().subject;
    const subject_dimensions = (subject && subject.imageMetadata) ? subject.imageMetadata : [];
    const classification = getState().classifications.classification;
    
    //TODO: Better error handling
    if (!classification) { alert('ERROR: Could not create Classification.'); return; }
    
    dispatch({ type: SUBMIT_CLASSIFICATION });
    classification.annotations.push(annotations);
    classification.update({
      completed: true,
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
      //Log
      console.log('Submit classification: Success');
      Split.classificationCreated(classification);

      //Reset values in preparation for the next Subject.
      dispatch({ type: SUBMIT_CLASSIFICATION_SUCCESS });
      dispatch(resetAnnotations());
      dispatch(resetPreviousAnnotations());
      dispatch(createClassification());
      dispatch(fetchSubject());
      dispatch(resetView());
    })

    //Unsuccessful save
    .catch((err) => {
      //TODO: Proper error handling
      console.error('Submit classification: Error - ', err);
      alert('ERROR: Could not submit Classification');

      dispatch({ type: SUBMIT_CLASSIFICATION_ERROR });
    });

  };
};

export default classificationReducer;

//------------------------------------------------------------------------------

//Exports

export {
  createClassification,
  submitClassification,
};
