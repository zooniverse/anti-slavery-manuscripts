/*
Redux Duck: Subject
-------------------

This duck (collection of redux actions + reducers) connects our app to the
Zooniverse Panoptes API service, allowing us to retrieve subjects from a given
project.

 */
import apiClient from 'panoptes-client/lib/api-client.js';

const FETCH_SUBJECT = 'FETCH_SUBJECT';
const FETCH_SUBJECT_SUCCESS = 'FETCH_SUBJECT_SUCCESS';
const FETCH_SUBJECT_ERROR = 'FETCH_SUBJECT_ERROR';

const TEMPORARY_HARDCODED_WORKFLOW_ID = '2628';
const SUBJECT_STATUS = {
  IDLE: 'subject_status_idle',
  FETCHING: 'subject_status_fetching',
  READY: 'subject_status_ready',
  ERROR: 'subject_status_error',
};

const initialState = {
  currentSubject: null,
  id: null,
  status: SUBJECT_STATUS.IDLE,
  queue: [],
};

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_SUBJECT:
      return Object.assign({}, state, {
        status: SUBJECT_STATUS.FETCHING,
        id: action.id,
      });

    case FETCH_SUBJECT_SUCCESS:
      return Object.assign({}, state, {
        currentSubject: action.currentSubject,
        status: SUBJECT_STATUS.READY,
        queue: action.queue,
      });

    case FETCH_SUBJECT_ERROR:
      return Object.assign({}, state, {
        status: SUBJECT_STATUS.ERROR,
      });

    default:
      return state;
  }
};

const fetchSubject = (id = TEMPORARY_HARDCODED_WORKFLOW_ID) => {
  return (dispatch, getState) => {

    dispatch({
      type: FETCH_SUBJECT,
      id,
    });

    const subjectQuery = {
      workflow_id: id,
    };

    const fetchQueue = () => {
      apiClient.type('subjects/queued').get(subjectQuery)
        .then((queue) => {
          const currentSubject = queue.shift();
          dispatch({
            currentSubject,
            queue,
            type: FETCH_SUBJECT_SUCCESS,
          });
        })
        .catch(() => {
          dispatch({ type: FETCH_SUBJECT_ERROR });
        });
    };

    if (!getState().subject.queue.length) {
      fetchQueue();
    } else {
      const currentSubject = getState().subject.queue.shift();
      dispatch({
        currentSubject,
        queue: getState().subject.queue,
        type: FETCH_SUBJECT_SUCCESS,
      });
    }
  };
};

export default subjectReducer;

export {
  fetchSubject,
  SUBJECT_STATUS,
};
