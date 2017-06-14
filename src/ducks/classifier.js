import apiClient from 'panoptes-client/lib/api-client.js';

// Action Types
const TEMPORARY_HARDCODED_PROJECT_ID = '1651';  //Staging: http://localhost:3735/projects/darkeshard/transformers
const FETCH_PROJECT = 'FETCH_PROJECT';
const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS';
const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR';

const PROJECT_IS_IDLE = 'not initialised';
const PROJECT_IS_FETCHING = 'fetching project...';
const PROJECT_IS_READY = 'project ready';
const PROJECT_IS_ERROR = 'ERROR!';

// Reducer
const initialState = {
  projectStatus: PROJECT_IS_IDLE,
  projectId: null,
  projectData: null,
};

const classifierReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT:
      return {
        projectStatus: PROJECT_IS_FETCHING,
        projectId: action.projectId,
        projectData: null,
      };
    default:
      return state;
  };
};

// Action Creators
const fetchProject = () {
  return (dispatch) => {
    const projectId = TEMPORARY_HARDCODED_PROJECT_ID;
    
    dispatch({
      type: FETCH_PROJECT,
      projectId,
    });
    
    apiClient.type('projects').get(projectId)
    .then((project) => {
      
      console.log(project);
      
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
