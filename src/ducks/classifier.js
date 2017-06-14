import apiClient from 'panoptes-client/lib/api-client.js';

// Action Types
const FETCH_PROJECT = 'FETCH_PROJECT';
const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS';
const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR';

// Misc Constants
const TEMPORARY_HARDCODED_PROJECT_ID = '1651';  //Staging: http://localhost:3735/projects/darkeshard/transformers
export const PROJECT_STATUS = {
  IDLE: 'project_status_idle',
  FETCHING: 'project_status_fetching',
  READY: 'project_status_ready',
  ERROR: 'project_status_error',
};

// Reducer
const initialState = {
  projectStatus: PROJECT_STATUS.IDLE,
  projectId: null,
  projectData: null,
};

const classifierReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT:
      return {
        projectStatus: PROJECT_STATUS.FETCHING,
        projectId: action.projectId,
        projectData: null,
      };
    case FETCH_PROJECT_SUCCESS:
      return {
        projectStatus: PROJECT_STATUS.READY,
        projectData: action.projectData,
      };
    case FETCH_PROJECT_ERROR:
      return {
        projectStatus: PROJECT_STATUS.ERROR,
      };
      
    default:
      return state;
  };
};

// Action Creators
const fetchProject = (projectId = TEMPORARY_HARDCODED_PROJECT_ID) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_PROJECT,
      projectId,
    });
    
    apiClient.type('projects').get(projectId)
    .then((project) => {
      dispatch({
        type: FETCH_PROJECT_SUCCESS,
        projectData: project,
      });
    })
    .catch((err) => {
      dispatch({ type: FETCH_PROJECT_ERROR });
    });
  };
}

// Exports
export default classifierReducer;

export {
 fetchProject
};
