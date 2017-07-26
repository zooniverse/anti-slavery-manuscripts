/*
Redux Duck: SubjectViewer
-------------------------

This duck (collection of redux actions + reducers) is used to control the view
options/settings of the SubjectViewer component.

 */

//Misc Constants
const SUBJECTVIEWER_STATE = {
  IDLE: 'idle',  //Eh, doing nothing.
  NAVIGATING: 'navigating',  //User wants to use the mouse to navigate the Subject.
  ANNOTATING: 'annotating',  //User has started, or is in the process of, adding annotations to the Subject.
}
const MIN_SCALING = 0.1;
const MAX_SCALING = 10;

//Initial State
const initialState = {
  //Image transformations
  contrast: false,
  rotation: 0,
  scaling: 1,
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
const SET_VIEWER_STATE = 'SET_VIEWER_STATE';
const UPDATE_VIEWER_SIZE = 'UPDATE_VIEWER_SIZE';
const UPDATE_IMAGE_SIZE = 'UPDATE_IMAGE_SIZE';

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

/*
--------------------------------------------------------------------------------
 */

export default subjectViewerReducer;

export {
  setContrast,
  setRotation,
  setScaling,
  setTranslation,
  resetView,
  setViewerState,
  updateViewerSize,
  updateImageSize,
  SUBJECTVIEWER_STATE,
};
