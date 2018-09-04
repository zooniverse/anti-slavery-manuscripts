/*
Workflow
--------

This duck manages the project's workflow.

--------------------------------------------------------------------------------
 */


import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';
import { setVariant, VARIANT_TYPES } from './splits';
import { fetchSubject, clearQueue } from './subject';

const RESET_WORKFLOW = 'RESET_WORKFLOW';
const FETCH_WORKFLOW = 'FETCH_WORKFLOW';
const FETCH_WORKFLOW_SUCCESS = 'FETCH_WORKFLOW_SUCCESS';
const FETCH_WORKFLOW_ERROR = 'FETCH_WORKFLOW_ERROR';
const SET_GOLD_STANDARD = 'SET_GOLD_STANDARD';

/*
--------------------------------------------------------------------------------
 */

// Constants
// ---------

const WORKFLOW_STATUS = {
  IDLE: 'workflow_status_idle',
  FETCHING: 'workflow_status_fetching',
  READY: 'workflow_status_ready',
  ERROR: 'workflow_status_error',
};

/*
--------------------------------------------------------------------------------
 */

// Initial State / Default Values
// ------------------------------

const WORKFLOW_INITIAL_STATE = {
  status: WORKFLOW_STATUS.IDLE,
  id: null,
  data: null,
  goldStandardMode: false
};

/*
--------------------------------------------------------------------------------
 */

const workflowReducer = (state = WORKFLOW_INITIAL_STATE, action) => {
  switch (action.type) {

    case RESET_WORKFLOW:
      return Object.assign({}, state, {
        status: WORKFLOW_INITIAL_STATE.status,
        id: WORKFLOW_INITIAL_STATE.id,
        data: WORKFLOW_INITIAL_STATE.data,
      });
      
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

    case SET_GOLD_STANDARD:
      return Object.assign({}, state, {
        goldStandardMode: action.gs
      });

    default:
      return state;
  };
};

/*
--------------------------------------------------------------------------------
 */

const resetWorkflow = () => {
  return (dispatch) => {
    dispatch({ type: RESET_WORKFLOW });
  };
}

const fetchWorkflow = (id) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_WORKFLOW,
      id,
    });

    return apiClient.type('workflows').get(id)
    .then((workflow) => {
      dispatch({
        type: FETCH_WORKFLOW_SUCCESS,
        data: workflow,
      });
    })
    .catch((err) => {
      console.error('ducks/workflow.js fetchWorkflow() error: ', err);
      dispatch({ type: FETCH_WORKFLOW_ERROR });
    });
  };
}

const setGoldStandard = () => {
  return (dispatch, getState) => {
    const isActive = !getState().workflow.goldStandardMode;
    const user = getState().login.user;

    if (isActive) {
      dispatch(setVariant(VARIANT_TYPES.INDIVIDUAL));
      dispatch(fetchWorkflow(config.zooniverseLinks.gsWorkflow)).then(() => {
        dispatch(clearQueue());
        dispatch(fetchSubject());
      });
    } else {
      //Refresh the page and get the settings back to normal.
      location.reload();
    }
    dispatch({ type: SET_GOLD_STANDARD, gs: isActive });
  };
};

/*
--------------------------------------------------------------------------------
 */

export default workflowReducer;

export {
  resetWorkflow,
  fetchWorkflow,
  setGoldStandard,
  WORKFLOW_STATUS,
  WORKFLOW_INITIAL_STATE,
};
