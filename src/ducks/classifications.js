import apiClient from 'panoptes-client/lib/api-client.js';

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
      console.log(classification);

    default:
      return state;
  }
};

const createClassification = () => {
  return (dispatch, getState) => {
    const classification = {
      annotations: [],
      metadata: {
        started_at: (new Date).toISOString(),
        user_agent: navigator.userAgent,
        utc_offset: ((new Date).getTimezoneOffset() * 60).toString(),
      },
      links: {
        project: getState().project.id,
        workflow: getState().workflow.id,
        subjects: [getState().subject.id]
      }
    }

    dispatch({
      type: CREATE_CLASSIFICATION,
      classification
    });
  };
};

const submitClassification = () => {
  return (dispatch, getState) => {
    const annotations = {
      _key: Math.random(),
      _toolIndex: 0,
      task: getState().workflow.data.first_task,
      value: getState().annotations.annotations,
    }

    dispatch({
      annotations,
      type: SUBMIT_CLASSIFICATION,
      task: getState().workflow.data.first_task
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
