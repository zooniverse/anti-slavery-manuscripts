import apiClient from 'panoptes-client/lib/api-client.js';
import counterpart from 'counterpart';
import { getSessionID } from '../lib/get-session-id';
import { Split } from 'seven-ten';

//Action Types
const SUBMIT_CLASSIFICATION = 'SUBMIT_CLASSIFICATION';
const CREATE_CLASSIFICATION = 'CREATE_CLASSIFICATION';

const initialState = {
  classification: null,
};

const classificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLASSIFICATION:
      return Object.assign({}, state, {
        classification: action.classification,
      });

    case SUBMIT_CLASSIFICATION:
      const classification = state.classification;
      classification.annotations.push(action.annotations);

      classification.update({
        completed: true,
        'metadata.finished_at': (new Date()).toISOString(),
        'metadata.viewport': {
          width: innerWidth,
          height: innerHeight
        },
        'metadata.subject_dimensions': action.subject_dimensions || [],
      })
      .save()
      
      //Successful save: reset everything, then get the next Subject.
      .then(() => {
        //Log
        console.log('Submit classification: Success');
        Split.classificationCreated(classification);
        
        //Reset values in preparation for the next Subject.
        return Object.assign({}, state, {
          classification: null,
        });
      })
      
      //Unsuccessful save
      .catch((err) => {
        //TODO: Proper error handling
        console.error('Submit classification: Error - ', err);
        alert('ERROR: Could not submit Classification');
        
        //Change nothing
        return Object.assign({}, state);
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

    let subject = getState().subject;
    let subject_dimensions = (subject && subject.imageMetadata) ? subject.imageMetadata : [];

    dispatch({
      annotations,
      type: SUBMIT_CLASSIFICATION,
      task,
      subject_dimensions,
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
