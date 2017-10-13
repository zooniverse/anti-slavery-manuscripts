/*
Redux Duck: Project
-------------------

This duck (collection of redux actions + reducers) connects our app to the
Zooniverse Panoptes API service, allowing us to get information about specific
projects.

 */
import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config.js';

//Action Types
const FETCH_PROJECT = 'FETCH_PROJECT';
const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS';
const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR';

//Misc Constants
const PROJECT_STATUS = {
  IDLE: 'project_status_idle',
  FETCHING: 'project_status_fetching',
  READY: 'project_status_ready',
  ERROR: 'project_status_error',
};

//------------------------------------------------------------------------------

//Reducer

const initialState = {
  status: PROJECT_STATUS.IDLE,
  id: null,
  data: {},
};

const classifierReducer = (state = initialState, action) => {
  switch (action.type) {

    //State Transition: we are going from idle to fetching a project.
    case FETCH_PROJECT:
      return Object.assign({}, state, {
        status: PROJECT_STATUS.FETCHING,
        id: action.id,
        data: {},
      });

    //State Transition: we tried fetching a project, and we're successful!
    case FETCH_PROJECT_SUCCESS:
      return Object.assign({}, state, {
        status: PROJECT_STATUS.READY,
        data: action.data,
      });

    //State Transition: we tried fetching a project, but that didn't work...
    case FETCH_PROJECT_ERROR:
      return Object.assign({}, state, {
        status: PROJECT_STATUS.ERROR,
      });

    default:
      return state;
  };
};

//------------------------------------------------------------------------------

//Action Creators

const fetchProject = (id = config.zooniverseLinks.projectId) => {
  return (dispatch) => {

    //Step 1: tell the Redux store that we're about to attempt to fetch a project.
    //We'll transition from an idle state to the 'currently-trying-to-fetch' state.
    dispatch({
      type: FETCH_PROJECT,
      id,
    });

    //Although fetchProject() is one simple function, it has three 'redux
    //actions' and four distinct states, simply to accommodate the nature of the
    //asynchronous Promise request. Speaking of which...

    //Step 2: Begin the asynchronous magic!
    apiClient.type('projects').get(id)
    .then((project) => {

      //Step 3a: Tell the Redux store we're successful, along with the data we fetched.
      dispatch({
        type: FETCH_PROJECT_SUCCESS,
        data: project,
      });

    })
    .catch((err) => {

      //Step 3b: Tell the Redux store we screwed up.
      dispatch({ type: FETCH_PROJECT_ERROR });

    });
  };
}

//------------------------------------------------------------------------------

//Exports

export default classifierReducer;

export {
  fetchProject,
  PROJECT_STATUS,
};
