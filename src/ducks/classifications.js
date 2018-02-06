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

const CLASSIFICATIONS_QUEUE_NAME = 'classificationsQueue';

//Action Types
const SUBMIT_CLASSIFICATION = 'SUBMIT_CLASSIFICATION';
const SUBMIT_CLASSIFICATION_FINISHED = 'SUBMIT_CLASSIFICATION_FINISHED';
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
        classification: null,
        status: CLASSIFICATION_STATUS.ERROR
      });

    case SUBMIT_CLASSIFICATION:
      return Object.assign({}, state,{
        status: CLASSIFICATION_STATUS.SENDING,
      });
      
    //Submitting Classification also resets the store.
    //This is only called once the WHOLE queue of Classifications has been processed.
    case SUBMIT_CLASSIFICATION_FINISHED:
      return Object.assign({}, state,{
        classification: null,
        status: CLASSIFICATION_STATUS.IDLE,  //We're not keeping track of the success/failure of individual Classifications in the queue, only that the queue has finished processing.
        subjectCompletionAnswers: {},
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

    console.info('ducks/classifications.js createClassification()');
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

/*  saveAllQueuedClassifications() attempts to individually submit
    Classifications to Panoptes. What happens is that:
    - When a new Classification is meant to be submitted, it is placed in a
      queue via queueClassification()
    - Then, each item in the queue is individually processed.
      (The queue is emptied at this point, and a new, empty queue is prepared.)
      - If the item (Classification) is successfully submitted/saved, that's it.
        (It's effectively removed from the queue.)
      - If the item fails, it's reinserted into the new queue, to be processed
        the next time a new Classification is submitted.
    - Once ALL the items are processed, we are now ready to prepare our data
      for the next Subject to be fetched.
 */
const saveAllQueuedClassifications = (dispatch, user = null) => {
  const QUEUE_NAME = (user)
    ? user.id + '.' + CLASSIFICATIONS_QUEUE_NAME
    : '_.' + CLASSIFICATIONS_QUEUE_NAME;
        
  const queue = JSON.parse(localStorage.getItem(QUEUE_NAME));

  if (queue && queue.length !== 0) {
    //Prepare 
    const newQueue = [];
    localStorage.setItem(QUEUE_NAME, null);  //Empty the queue first
    
    //Keep track of items processed so we know when ALL items are processed.
    let itemsProcessed = 0;
    let itemsFailed = 0;
    const itemsToProcess = queue.length;
    
    //Weirdly, Promise.prototype.finally() causes problems on some browsers. This is a workaround for it.
    //This is called after the Classification.save() EITHER SUCCEEDS or FAILS.
    //----------------
    const doFinally = () => {
      //That's one item down.
      itemsProcessed++;

      //Have all items been processed?
      if (itemsProcessed === itemsToProcess) {
        console.info(`ducks/classifications.js saveAllQueuedClassifications() finished: ${itemsProcessed} items processed, ${itemsFailed} failures`);

        //Did anything fail?
        if (itemsFailed > 0) {
          //TODO: better presentation
          alert('Your Transcription could not be submitted at this time. However, we\'ve saved your work on this computer and it will automatically be resubmitted the next time you submit a Transcription. Please refresh the page to start working on a new letter.');
        }

        //Save the new queue.
        localStorage.setItem(QUEUE_NAME, JSON.stringify(newQueue));

        //All done, get the next Subject!
        dispatch({ type: SUBMIT_CLASSIFICATION_FINISHED });
        dispatch(fetchSubject());  //Note: fetching a Subject will also reset Annotations, reset Previous Annotations, and create an empty Classification.
        dispatch(resetView());
      }
    };
    //----------------
    
    //Now, attempt to save.
    //----------------
    queue.forEach((classificationData) => {
      //Let's send those Classifications!
      apiClient.type('classifications').create(classificationData).save()
      
      //SUCCESS
      .then((classificationObject) => {
        console.info('ducks/classifications.js saveAllQueuedClassifications() success: item ', classificationObject.id);

        try {
          Split.classificationCreated(classificationObject);
        } catch (err) { console.error('Split.classificationCreated() error: ', err); }

        //Record locally that the Classification has been seen.
        const { workflow, subjects } = classificationObject.links;
        dispatch(addAlreadySeen(workflow, subjects));
        
        //OK, we don't need you any more, Classification. Why is this here? It's in PFE.
        //TODO: check
        classificationObject.destroy();
        
        doFinally();
      })
      
      //FAILURE
      .catch((err) => {
        //Ah, crap.
        console.error('ducks/classifications.js saveAllQueuedClassifications() error: ', err);
        Rollbar && Rollbar.error &&
        Rollbar.error('ducks/classifications.js saveAllQueuedClassifications() error: ', err);

        //Right, why did it fail?
        switch (err.status) {
          case 422:  //If the reason for failure is that Panoptes returned a 422, it means the Classification was bad and should be discarded.
            break;

          default:  //Otherwise, the failed Classification should be re-queued for the next time attempt.
            itemsFailed++;  //Let the user know that the Classification will be re-queued.
            newQueue.push(classificationData);
        }
        
        doFinally();
      });
    });
    //----------------
  }
};

const queueClassification = (classification, user = null) => {
  const QUEUE_NAME = (user)
    ? user.id + '.' + CLASSIFICATIONS_QUEUE_NAME
    : '_.' + CLASSIFICATIONS_QUEUE_NAME;
  
  const queue = JSON.parse(localStorage.getItem(QUEUE_NAME)) || [];
  queue.push(classification);

  try {
    if (user) {
      localStorage.removeItem(`${user.id}.classificationID`);
    }
    localStorage.setItem(QUEUE_NAME, JSON.stringify(queue));
    console.info('ducks/classifications.js queueClassification() added: ', queue.length);
  } catch (err) {
    //WARNING: if an error appears here, unlikely as it may be, the error might
    //be catastrophic enough to warrant an alert().
    console.error('ducks/classifications.js queueClassification() error: ', err);
    Rollbar && Rollbar.error &&
    Rollbar.error('ducks/classifications.js queueClassification() error: ', err);
  }
};

const submitClassification = () => {
  return (dispatch, getState) => {
    console.info('ducks/classifications.js submitClassification()');

    //Initialise
    //----------------
    const subject = getState().subject;
    const subject_dimensions = (subject && subject.imageMetadata) ? subject.imageMetadata : [];
    const classification = getState().classifications.classification;
    const updatedAnnotations = [];  //Always start empty (don't pull anything from classification.annotation) the build the array based on the answers we have.
    const user = getState().login.user;

    if (!classification) {
      console.error('ducks/classifications.js submitClassification() error: no classification', '');
      Rollbar && Rollbar.error &&
      Rollbar.error('ducks/classifications.js submitClassification() error: no classification', '');  //TODO: better presentation
      alert('ERROR: Could not submit Classification.');
      return;
    }
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
    console.info('ducks/classifications.js submitClassification() checkpoint');
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
    });
    queueClassification(classification, user);
    saveAllQueuedClassifications(dispatch, user);
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
    console.info('ducks/classifications.js retrieveClassification()');

    apiClient.type('classifications/incomplete').get({ id })
      .then(([classification]) => {
        const subjectId = (classification.links && classification.links.subjects && classification.links.subjects.length > 0)
          ? classification.links.subjects[0] : null;
        const annotations = (classification.annotations)
          ? classification.annotations[0] : { value: [] };
        if (subjectId === null) { throw 'Subject ID could not be determined.'; }

        console.info('ducks/classifications.js retrieveClassification() success');
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
    console.info('ducks/classifications.js saveClassificationInProgressClassification()');

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

    console.info('ducks/classifications.js saveClassificationInProgressClassification() checkpoint');

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
      console.info('ducks/classifications.js saveClassificationInProgress() success');
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
