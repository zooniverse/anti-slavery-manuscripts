
import { Tutorial } from 'zooniverse-react-components';

const FETCH_TUTORIAL = 'FETCH_TUTORIAL';
const FETCH_TUTORIAL_SUCCESS = 'FETCH_TUTORIAL_SUCCESS';
const FETCH_TUTORIAL_ERROR = 'FETCH_TUTORIAL_ERROR';

//Misc Constants
const TUTORIAL_STATUS = {
  IDLE: 'tutorial_status_idle',
  FETCHING: 'tutorial_status_fetching',
  READY: 'tutorial_status_ready',
  ERROR: 'tutorial_status_error',
};

const initialState = {
  data: null,
  status: TUTORIAL_STATUS.IDLE,
};

const tutorialReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TUTORIAL:
      return {
        status: TUTORIAL_STATUS.FETCHING
      };

    case FETCH_TUTORIAL_SUCCESS:
      return Object.assign({}, state, {
        status: TUTORIAL_STATUS.READY,
        data: action.data
      })

    case FETCH_TUTORIAL_ERROR:
      return Object.assign({}, state, {
        status: TUTORIAL_STATUS.ERROR,
      });

    default:
      return state;
  };
};

const fetchTutorial = (workflow) => {
  return (dispatch, getState) => {

    dispatch({
      type: FETCH_TUTORIAL,
    });

    Tutorial.find(workflow).then((tutorial) => {
      dispatch({
        type: FETCH_TUTORIAL_SUCCESS,
        data: tutorial
      })
    })
    .catch((err) => {
      console.error('ducks/tutorial.js fetchTutorial() error: ', err);
      dispatch({ type: FETCH_TUTORIAL_ERROR });
    });
  };
};

export default tutorialReducer;

export {
 fetchTutorial,
 TUTORIAL_STATUS
};
