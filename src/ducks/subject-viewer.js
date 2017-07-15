/*
Redux Duck: SubjectViewer
-------------------------

This duck (collection of redux actions + reducers) is used to control the view
options/settings of the SubjectViewer component.

 */

const initialState = {
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
};

//Action Types
const SET_ROTATION = 'SET_ROTATION';
const SET_SCALING = 'SET_SCALING';
const SET_TRANSLATION = 'SET_TRANSLATION';

/*
--------------------------------------------------------------------------------
 */

const subjectViewerReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_ROTATION:
      return Object.assign({}, state, {
        rotation: action.angle
      });
    
    case SET_SCALING:
      return Object.assign({}, state, {
        scaling: action.scale
      });
    
    case SET_TRANSLATION:
      return Object.assign({}, state, {
        translationX: action.x,
        translationY: action.y,
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
}

const setScaling = (scale) => {
  return (dispatch) => {
    dispatch({
      type: SET_SCALING,
      scale,
    });
  }
}

const setTranslation = (x, y) => {
  return (dispatch) => {
    dispatch({
      type: SET_TRANSLATION,
      x, y,
    });
  }
}

/*
--------------------------------------------------------------------------------
 */

export default subjectViewerReducer;

export {
  setRotation,
  setScaling,
  setTranslation,
};
