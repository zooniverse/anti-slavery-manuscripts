/*
Redux Duck: SubjectViewer
-------------------------

This duck (collection of redux actions + reducers) is used to control the view
options/settings of the SubjectViewer component.

 */
import { CONSENSUS_SCORE } from '../config';
import { VARIANT_TYPES } from '../ducks/splits';

//Misc Constants
const SUBJECTVIEWER_STATE = {
  IDLE: 'idle',  //Eh, doing nothing.
  NAVIGATING: 'navigating',  //User wants to use the mouse to navigate the Subject.
  ANNOTATING: 'annotating',  //User has started, or is in the process of, adding annotations to the Subject.
  CROPPING: 'cropping'
}
const MIN_SCALING = 0.1;
const MAX_SCALING = 10;

const MARKS_STATE = {
  ALL: 0,
  USER: 1,
  NONE: 2,
};

//Initial State
const initialState = {
  //Image transformations
  contrast: false,
  frame: 0,
  rotation: 0,
  scaling: 1,
  shownMarks: MARKS_STATE.ALL,
  translationX: 0,
  translationY: 0,

  //Viewer settings
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
  viewerSize: { width: 0, height: 0 },
  imageSize: { width: 0, height: 0 },
};

//Action Types
const TOGGLE_CONTRAST = 'TOGGLE_CONTRAST';
const SET_ROTATION = 'SET_ROTATION';
const SET_SCALING = 'SET_SCALING';
const SET_TRANSLATION = 'SET_TRANSLATION';
const RESET_VIEW = 'RESET_VIEW';
const TOGGLE_MARKS = 'TOGGLE_MARKS';
const SET_VIEWER_STATE = 'SET_VIEWER_STATE';
const UPDATE_VIEWER_SIZE = 'UPDATE_VIEWER_SIZE';
const UPDATE_IMAGE_SIZE = 'UPDATE_IMAGE_SIZE';
const CHANGE_FRAME = 'CHANGE_FRAME';

/*
--------------------------------------------------------------------------------
 */

const subjectViewerReducer = (state = initialState, action) => {
  switch (action.type) {

    case TOGGLE_CONTRAST:
      return Object.assign({}, state, {
        contrast: !state.contrast,
      });

    case SET_ROTATION:
      let newAngle = action.angle;
      //Ensure angle normalises to within 0-360 degrees.
      while (newAngle < 0) { newAngle += 360; }  //JS's mod (%) acts weird with negatives.
      newAngle = newAngle % 360;

      return Object.assign({}, state, {
        rotation: newAngle
      });

    case TOGGLE_MARKS:
      return Object.assign({}, state, {
        shownMarks: action.shownMarks
      });

    case SET_SCALING:
      let newScale = (action.scale) ? action.scale : state.scaling;
      newScale = Math.max(MIN_SCALING, Math.min(MAX_SCALING, newScale));

      return Object.assign({}, state, {
        scaling: newScale,
      });

    case SET_TRANSLATION:
      return Object.assign({}, state, {
        translationX: action.x,
        translationY: action.y,
      });

    case RESET_VIEW:
      let bestFitScale = 1;
      if (state.viewerSize.width && state.viewerSize.height &&
          state.imageSize.width && state.imageSize.height) {
        bestFitScale = Math.min(
          state.viewerSize.width / state.imageSize.width,
          state.viewerSize.height / state.imageSize.height
        );
      }

      return Object.assign({}, state, {
        rotation: 0,
        scaling: bestFitScale,
        translationX: 0,
        translationY: 0,
      });

    case SET_VIEWER_STATE:
      return Object.assign({}, state, {
        viewerState: action.viewerState,
      });

    case UPDATE_VIEWER_SIZE:
      return Object.assign({}, state, {
        viewerSize: {
          width: action.width,
          height: action.height,
        },
      });

    case UPDATE_IMAGE_SIZE:
      return Object.assign({}, state, {
        imageSize: {
          width: action.width,
          height: action.height,
        },
      });

    case CHANGE_FRAME:
      return Object.assign({}, state, {
        frame: action.frame
      });

    default:
      return state;
  }
};

/*
--------------------------------------------------------------------------------
 */

const setContrast = () => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_CONTRAST,
    });
  }
};

const setRotation = (angle) => {
  return (dispatch) => {
    dispatch({
      type: SET_ROTATION,
      angle,
    });
  }
};

const setScaling = (scale) => {
  return (dispatch) => {
    dispatch({
      type: SET_SCALING,
      scale,
    });
  }
};

const setTranslation = (x, y) => {
  return (dispatch) => {
    dispatch({
      type: SET_TRANSLATION,
      x, y,
    });
  }
};

const resetView = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_VIEW,
    });
  }
};

const togglePreviousMarks = () => {
  return (dispatch, getState) => {
    const annotations = getState().previousAnnotations.marks;
    const variant = getState().splits.variant;
    const consensusAnnotation = annotations.some(annotation => { return annotation.consensusReached; })
    const previousAnnotationsPresent = consensusAnnotation || (annotations.length && variant === VARIANT_TYPES.COLLABORATIVE);
    const numberOfStates = Object.keys(MARKS_STATE).length;

    let shownMarks = (getState().subjectViewer.shownMarks + 1) % numberOfStates;
    if (!previousAnnotationsPresent && shownMarks === MARKS_STATE.USER) {
      shownMarks = MARKS_STATE.NONE;
    }

    dispatch({
      type: TOGGLE_MARKS,
      shownMarks
    });
  }
};

const setViewerState = (viewerState) => {
  return (dispatch) => {
    dispatch({
      type: SET_VIEWER_STATE,
      viewerState,
    });
  }
};

const updateViewerSize = (width, height) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_VIEWER_SIZE,
      width, height,
    });
  }
};

const updateImageSize = (width, height) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_IMAGE_SIZE,
      width, height,
    });
  }
};

const changeFrame = (frame) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_FRAME,
      frame
    });
  }
};

/*
--------------------------------------------------------------------------------
 */

export default subjectViewerReducer;

export {
  changeFrame,
  setContrast,
  setRotation,
  setScaling,
  setTranslation,
  resetView,
  setViewerState,
  togglePreviousMarks,
  updateViewerSize,
  updateImageSize,
  MARKS_STATE,
  SUBJECTVIEWER_STATE,
};
