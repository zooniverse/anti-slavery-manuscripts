/*
Redux Duck: Annotations
-------------------

...

 */

//Action Types
const ADD_ANNOTATION_POINT = 'ADD_ANNOTATION_POINT';
const COMPLETE_ANNOTATION = 'COMPLETE_ANNOTATION';
const SELECT_ANNOTATION = 'SELECT_ANNOTATION';
const UNSELECT_ANNOTATION = 'UNSELECT_ANNOTATION';

//Misc Constants
const ANNOTATION_STATUS = {
  IDLE: 'annotation_status_idle',
  IN_PROGRESS: 'annotation_status_in_progress',
};

//------------------------------------------------------------------------------

//Reducer

//Note: a single Annotation should look like this:
//{ text: "Example text",
//  points: [
//    { x: 20, y: 5 }, ...
//  ]
//}

const initialState = {
  status: ANNOTATION_STATUS.IDLE,
  annotationInProgress: null,  //Incomplete annotation. null if nothing is in progress.
  annotations: [],  //Completed annotations.
  selectedAnnotation: null,  //Existing annotation that's been selected, by clicking on them. null if nothing is selected.
};

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ANNOTATION_POINT:
      const annotationInProgress = (state.annotationInProgress)
        ? Object.assign({}, state.annotationInProgress) //Create a copy, don't modify the existing object.
        : { text: '', points: [] };
      annotationInProgress.points.push({ x: action.x, y: action.y });
      return Object.assign({}, state, {
        status: ANNOTATION_STATUS.IN_PROGRESS,
        annotationInProgress,
      });
    
    case COMPLETE_ANNOTATION:
      const annotations = (state.annotations)
        ? state.annotations.splice(0)  //Make a copy, don't just modify the current object, just to be sure we trigger Redux-React changers.
        : [];
      annotations.push(state.annotationInProgress);
      return Object.assign({}, state, {
        status: ANNOTATION_STATUS.IDLE,
        annotationInProgress: null,
        annotations,
        selectedAnnotation: state.annotationInProgress,  //Auto-select latest annotation.
      });
    
    case SELECT_ANNOTATION:
      const selectedAnnotation = (state.annotations && state.annotations[action.index])
        ? state.annotations[action.index]
        : null;
      return Object.assign({}, state, {
        selectedAnnotation,
      });
    
    case UNSELECT_ANNOTATION:
      return Object.assign({}, state, {
        selectedAnnotation: null,
      });
      
    default:
      return state;
  }
};

//------------------------------------------------------------------------------

//Action Creators

const addAnnotationPoint = (x, y) => {
  return (dispatch) => {
    dispatch({
      type: ADD_ANNOTATION_POINT,
      x, y,
    });
  };
};

const selectAnnotation = (index) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_ANNOTATION,
      index
    });
  };
};

const unselectAnnotation = () => {
  return (dispatch) => {
    dispatch({
      type: UNSELECT_ANNOTATION,
    });
  };
};

const completeAnnotation = () => {
  return (dispatch) => {
    dispatch({
      type: COMPLETE_ANNOTATION,
    });
  };
};

export default subjectReducer;

//------------------------------------------------------------------------------

//Exports

export {
  addAnnotationPoint, completeAnnotation,
  selectAnnotation, unselectAnnotation,
  ANNOTATION_STATUS,
};
