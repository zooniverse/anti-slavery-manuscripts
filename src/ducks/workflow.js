import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';
import { VARIANT_TYPES } from './splits';

const FETCH_WORKFLOW = 'FETCH_WORKFLOW';
const FETCH_WORKFLOW_SUCCESS = 'FETCH_WORKFLOW_SUCCESS';
const FETCH_WORKFLOW_ERROR = 'FETCH_WORKFLOW_ERROR';

const WORKFLOW_STATUS = {
  IDLE: 'workflow_status_idle',
  FETCHING: 'workflow_status_fetching',
  READY: 'workflow_status_ready',
  ERROR: 'workflow_status_error',
};

const initialState = {
  status: WORKFLOW_STATUS.IDLE,
  id: null,
  data: null,
};

const workflowReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_WORKFLOW:
      return Object.assign({}, state, {
        status: WORKFLOW_STATUS.FETCHING,
        id: action.id,
        data: null,
      });

    case FETCH_WORKFLOW_SUCCESS:
      return Object.assign({}, state, {
        status: WORKFLOW_STATUS.READY,
        data: action.data,
      });

    case FETCH_WORKFLOW_ERROR:
      return Object.assign({}, state, {
        status: WORKFLOW_STATUS.ERROR,
      });

    default:
      return state;
  };
};

const fetchWorkflow = (variant = VARIANT_TYPES.INDIVIDUAL) => {
  const id = variant === VARIANT_TYPES.COLLABORATIVE ?
    config.zooniverseLinks.collabWorkflowId :
    config.zooniverseLinks.workflowId;

  return (dispatch) => {
    dispatch({
      type: FETCH_WORKFLOW,
      id,
    });

    apiClient.type('workflows').get(id)
    .then((workflow) => {

      dispatch({
        type: FETCH_WORKFLOW_SUCCESS,
        data: workflow,
      });

    })
    .catch((err) => {

      dispatch({ type: FETCH_WORKFLOW_ERROR });

    });
  };
}

export default workflowReducer;

export {
  fetchWorkflow,
  WORKFLOW_STATUS,
};
