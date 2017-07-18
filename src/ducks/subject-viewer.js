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
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
};

//Action Types
const SET_ROTATION = 'SET_ROTATION';
const SET_SCALING = 'SET_SCALING';
const SET_TRANSLATION = 'SET_TRANSLATION';
const RESET_TRANSFORMATIONS = 'RESET_TRANSFORMATIONS';
const SET_VIEWER_STATE = 'SET_VIEWER_STATE';

/*
--------------------------------------------------------------------------------
 */

const subjectViewerReducer = (state = initialState, action) => {
  switch (action.type) {

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
      
    case RESET_TRANSFORMATIONS:
      return Object.assign({}, state, {
        rotation: 0,
        scaling: 1,
        translationX: 0,
        translationY: 0,
      });
    
    case SET_VIEWER_STATE:
      return Object.assign({}, state, {
        viewerState: action.viewerState,
      });
    
    default:
      return state;
  }
};

/*
--------------------------------------------------------------------------------
 */

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

const resetTransformations = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_TRANSFORMATIONS,
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

/*
--------------------------------------------------------------------------------
 */

export default subjectViewerReducer;

export {
  setRotation,
  setScaling,
  setTranslation,
  resetTransformations,
  setViewerState,
  SUBJECTVIEWER_STATE,
};
