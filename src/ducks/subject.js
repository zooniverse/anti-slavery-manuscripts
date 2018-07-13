/*
Redux Duck: Subject
-------------------

This duck (collection of redux actions + reducers) connects our app to the
Zooniverse Panoptes API service, allowing us to retrieve subjects from a given
project.

 */
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client.js';
import { config, subjectSets } from '../config';

import { createClassification } from './classifications';
import { resetAnnotations } from './annotations';
import { fetchPreviousAnnotations } from './previousAnnotations';
import { changeFrame } from './subject-viewer';
import { toggleDialog } from './dialog';
import ClassificationPrompt from '../components/ClassificationPrompt';

const FETCH_SUBJECT = 'FETCH_SUBJECT';
const FETCH_SUBJECT_SUCCESS = 'FETCH_SUBJECT_SUCCESS';
const FETCH_SUBJECT_ERROR = 'FETCH_SUBJECT_ERROR';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
const SET_IMAGE_METADATA = 'SET_IMAGE_METADATA';
const SET_SUBJECT_SET = 'SET_SUBJECT_SET';
const SET_SUBJECT_ID = 'SET_SUBJECT_ID';
const CLEAR_QUEUE = 'CLEAR_QUEUE';
const ADD_ALREADY_SEEN = 'ADD_ALREADY_SEEN';
const CHECK_ALREADY_SEEN = 'CHECK_ALREADY_SEEN';

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
  subjectSet: null,
  alreadySeen: [],
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
        queue: action.queue || state.queue,
        favorite: action.favorite,
      });

    case CLEAR_QUEUE:
      return Object.assign({}, state, {
        queue: [],
        status: action.status,
        currentSubject: action.currentSubject
      });

    case SET_SUBJECT_SET:
      return Object.assign({}, state, {
        subjectSet: action.id,
        queue: [],
      });

    case SET_SUBJECT_ID:  //Only used for emergencyLoadWorkInProgress() to bypass standard Subject ID selection.
      return Object.assign({}, state, {
        id: action.id,
        queue: [],
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
        imageMetadata,
      });

    case ADD_ALREADY_SEEN:
      return Object.assign({}, state, {
        alreadySeen: action.alreadySeen,
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
    links,
  };
  const newFavorites = apiClient.type('collections')
    .create(collection)
    .save()
    .catch(err => Promise.reject(err));
  return newFavorites;
};

function addSubjectToCollection(collection, subjectId) {
  collection.addLink('subjects', [subjectId]);
}

function removeSubjectToCollection(collection, subjectId) {
  collection.removeLink('subjects', [subjectId]);
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
          addSubjectToCollection(collection, subject.id);
        } else if (collection && favorite) {
          removeSubjectToCollection(collection, subject.id);
        } else {
          createFavorites(getState().project).then((collection) => addSubjectToCollection(collection, subject.id));
        }
      })
    }
  }
};

const setImageMetadata = (frameId, metadata) => {
  return (dispatch) => {
    dispatch({
      type: SET_IMAGE_METADATA,
      frameId,
      metadata,
    });
  };
};

const selectSubjectSet = (id) => {
  console.info('ducks/subject.js selectSubjectSet(): id ', id);
  return (dispatch) => {
    dispatch({
      type: SET_SUBJECT_SET,
      id
    });
  };
};


//Only used for emergencyLoadWorkInProgress() to bypass standard Subject ID selection.
const setSubjectId = (id) => {
  return (dispatch) => {
    dispatch({
      type: SET_SUBJECT_ID,
      id
    });
  };
};

/*  Fetches a Subject from Panoptes, based on the specified/default Panoptes
    Workflow ID. If `initialFetch` is true, then this call to fetchSubject() is
    meant to be the first fetchSubject of the user's session. Hence, the Subject
    will ONLY be fetched IF no Subject has previously been fetched.
 */
const fetchSubject = (initialFetch = false) => {
  return (dispatch, getState) => {
    console.info('ducks/subject.js fetchSubject() init');
    if (initialFetch && getState().subject.status !== SUBJECT_STATUS.IDLE) return;
    const workflow_id = getState().workflow.id;
    console.info('ducks/subject.js fetchSubject(): workflow_id ', workflow_id);

    dispatch({
      type: FETCH_SUBJECT,
    });

    // INITIAL_LAUNCH_ONLY
    //----------------
    let subjectQuery = { workflow_id };

    let randomSubjectSet;
    const workflow = getState().workflow.data;
    if (workflow && workflow.links.subject_sets.length) {
      const linkedSets = workflow.links.subject_sets;
      randomSubjectSet = linkedSets[Math.floor(Math.random() * linkedSets.length)];
    } else {
      randomSubjectSet = subjectSets[Math.floor(Math.random() * subjectSets.length)].id;
    }
    subjectQuery.subject_set_id = randomSubjectSet;

    // Removed for //INITIAL_LAUNCH_ONLY
    // if (getState().subject.subjectSet) {
    //   subjectQuery.subject_set_id = getState().subject.subjectSet;
    // }
    //----------------

    console.info('ducks/subject.js fetchSubject(): subject_set_id ', subjectQuery.subject_set_id);

    const gsMode = getState().workflow.goldStandardMode;
    if (gsMode) {
      subjectQuery = { workflow_id: config.zooniverseLinks.gsWorkflow };
    }
    const fetchQueue = () => {
      return apiClient.type('subjects/queued').get(subjectQuery)
        .then((queue) => {
          const currentSubject = queue.shift();
          dispatch({
            currentSubject,
            id: currentSubject.id,
            queue,
            type: FETCH_SUBJECT_SUCCESS,
            favorite: currentSubject.favorite || false,
          });

          console.info('ducks/subject.js fetchSubject() fetch subject success: subject id ', currentSubject.id);
          prepareForNewSubject(dispatch, currentSubject);
        })
        .catch((err) => {
          console.error('ducks/subject.js fetchSubject() error: ', err);
          dispatch({ type: FETCH_SUBJECT_ERROR });
        });
    };

    if (!getState().subject.queue.length) {  //If not, check if there are any subjects left in the queue.
      fetchQueue();
    } else {
      const currentSubject = getState().subject.queue.shift();
      dispatch({
        currentSubject,
        id: currentSubject.id,
        queue: getState().subject.queue,
        type: FETCH_SUBJECT_SUCCESS,
        favorite: currentSubject.favorite || false,
      });

      prepareForNewSubject(dispatch, currentSubject);
    }
  };
};

/*  In preparation for a new Subject being successfully loaded, reset all
    existing Annotations, (reset then) fetch the corresponding Previous
    Annotations, create a new Classification, and set the viewer back to page 1.
 */
const prepareForNewSubject = (dispatch, subject) => {
  dispatch(resetAnnotations());
  dispatch(fetchPreviousAnnotations(subject));
  dispatch(createClassification());
  dispatch(changeFrame(0));
};

const fetchSavedSubject = (id) => {
  return (dispatch) => {
    return apiClient.type('subjects').get(id)
      .then((currentSubject) => {
        dispatch(fetchPreviousAnnotations(currentSubject));
        dispatch(changeFrame(0));
        dispatch({
          type: FETCH_SUBJECT_SUCCESS,
          favorite: currentSubject.favorite || false,
          currentSubject,
          id,
        });
        return currentSubject;
      })
      .catch((err) => {
        console.error('ducks/subject.js fetchSavedSubject() error: ', err);
        dispatch({ type: FETCH_SUBJECT_ERROR });
      });
  };
};

const clearQueue = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_QUEUE,
      status: SUBJECT_STATUS.IDLE,
      currentSubject: null,
    });
  };
};

const addAlreadySeen = (workflowId, subjectIds) => {
  return (dispatch, getState) => {
    const alreadySeen = getState().subject.alreadySeen.slice();
    subjectIds.map((subjectId) => {
      alreadySeen.push(`${workflowId}/${subjectId}`);

      dispatch({
        type: ADD_ALREADY_SEEN,
        alreadySeen,
      });
    });
  };
};

export default subjectReducer;

export {
  addAlreadySeen,
  clearQueue,
  toggleFavorite,
  fetchSubject,
  fetchSavedSubject,
  selectSubjectSet,
  setSubjectId,
  setImageMetadata,
  prepareForNewSubject,
  SUBJECT_STATUS,
};
