/*
Redux Duck: Subject
-------------------

This duck (collection of redux actions + reducers) connects our app to the
Zooniverse Panoptes API service, allowing us to retrieve subjects from a given
project.

 */
import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';

const FETCH_SUBJECT = 'FETCH_SUBJECT';
const FETCH_SUBJECT_SUCCESS = 'FETCH_SUBJECT_SUCCESS';
const FETCH_SUBJECT_ERROR = 'FETCH_SUBJECT_ERROR';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
const SET_IMAGE_METADATA = 'SET_IMAGE_METADATA';

const SUBJECT_STATUS = {
  IDLE: 'subject_status_idle',
  FETCHING: 'subject_status_fetching',
  READY: 'subject_status_ready',
  ERROR: 'subject_status_error',
};

const initialState = {
  currentSubject: null,
  imageMetadata: [],  //metadata for each image in the Subject; a single image is defined by subject.location.
  id: null,
  status: SUBJECT_STATUS.IDLE,
  queue: [],
  favorite: false
};

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_SUBJECT:
      return Object.assign({}, state, {
        status: SUBJECT_STATUS.FETCHING,
      });

    case FETCH_SUBJECT_SUCCESS:
      return Object.assign({}, state, {
        currentSubject: action.currentSubject,
        imageMetadata: [],
        status: SUBJECT_STATUS.READY,
        id: action.id,
        queue: action.queue,
        favorite: action.favorite,
      });

    case FETCH_SUBJECT_ERROR:
      return Object.assign({}, state, {
        status: SUBJECT_STATUS.ERROR,
      });

    case TOGGLE_FAVORITE:
      return Object.assign({}, state, {
        favorite: action.favorite,
      });
      
    case SET_IMAGE_METADATA:      
      let imageMetadata = state.imageMetadata.slice();
      if (action.frameId !== null) {
        imageMetadata[action.frameId] = Object.assign({}, imageMetadata[action.frameId], action.metadata);
      }
      
      return Object.assign({}, state, {
        imageMetadata
      });
      

    default:
      return state;
  }
};

const createFavorites = (project) => {
  const links = {
    subjects: [],
    projects: [project.id],
  };
  const display_name = (project.data) ? project.data.display_name : 'UNKNOWN PROJECT';
  const collection = {
    favorite: true,
    display_name,
    links
  };
  apiClient.type('collections')
    .create(collection)
    .save()
    .catch((err) => {
      reject(err);
    })
}

const toggleFavorite = () => {
  return (dispatch, getState) => {
    const projectID = getState().project.id;
    const favorite = getState().subject.favorite;
    const user = getState().login.user.login;
    const subject = getState().subject.currentSubject;
    dispatch({ type: TOGGLE_FAVORITE, favorite: !favorite });

    if (user) {
      apiClient.type('collections').get({
        project_ids: projectID,
        favorite: true,
        owner: user
      }).then(([collection]) => {
        if (collection && !favorite) {
          collection.addLink('subjects', [subject.id.toString()]);
        } else if (collection && favorite) {
          collection.removeLink('subjects', [subject.id.toString()]);
        } else {
          createFavorites(getState().project);
        }
      })
    }
  }
}

const setImageMetadata = (frameId, metadata) => {
  return (dispatch) => {
    dispatch({
      type: SET_IMAGE_METADATA,
      frameId,
      metadata,
    });
  };
}

const fetchSubject = (id = config.defaultWorkflowId) => {
  return (dispatch, getState) => {

    dispatch({
      type: FETCH_SUBJECT,
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
            id: currentSubject.id,
            queue,
            type: FETCH_SUBJECT_SUCCESS,
            favorite: currentSubject.favorite || false,
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
  toggleFavorite,
  fetchSubject,
  setImageMetadata,
  SUBJECT_STATUS,
};
