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
const COLLABORATE_WITH_ANNOTATION = 'COLLABORATE_WITH_ANNOTATION';
const UPDATE_TEXT = 'UPDATE_TEXT';
const SAVE_TEXT = 'SAVE_TEXT';

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
  annotationPanePosition: null,
  annotations: [],  //Completed annotations.
  selectedAnnotation: null,  //Existing annotation that's been selected, by clicking on them. null if nothing is selected.
  selectedAnnotationIndex: null,
};

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ANNOTATION_POINT:
      const annotationInProgress = (state.annotationInProgress)
        ? Object.assign({}, state.annotationInProgress) //Create a copy, don't modify the existing object.
        : { details: [{value: ''}], points: [], frame: action.frame };
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
      const endPoint = state.annotationInProgress.points[state.annotationInProgress.points.length - 1];
      return Object.assign({}, state, {
        status: ANNOTATION_STATUS.IDLE,
        annotationInProgress: null,
        annotations,
        annotationPanePosition: endPoint,
        selectedAnnotation: state.annotationInProgress,  //Auto-select latest annotation.
        selectedAnnotationIndex: annotations.length - 1
      });

    case SELECT_ANNOTATION:
      const selectedAnnotation = action.annotation ? action.annotation : null;
      const annotationPanePosition = selectedAnnotation.points[selectedAnnotation.points.length - 1];
      return Object.assign({}, state, {
        selectedAnnotation,
        annotationPanePosition,
        selectedAnnotationIndex: action.index,
      });

    case COLLABORATE_WITH_ANNOTATION:
      const userAnnotations = (state.annotations)
        ? state.annotations.splice(0)
        : [];
      const newAnnotation = {
        details: [{ value: action.text }],
        points: action.annotation.points,
        frame: action.annotation.frame
      };
      userAnnotations.push(newAnnotation);

      return Object.assign({}, state, {
        annotations: userAnnotations
      });

    case UPDATE_TEXT:
      const newDetails = [{value: action.text}];
      const annotationCopy = state.annotations.slice();
      const updatedAnnotation = annotationCopy[state.selectedAnnotationIndex];
      updatedAnnotation.details = newDetails;

      return Object.assign({}, state, {
        annotations: annotationCopy
      });

    case UNSELECT_ANNOTATION:
      return Object.assign({}, state, {
        annotationPanePosition: null,
        selectedAnnotation: null,
        selectedAnnotationIndex: null
      });

    default:
      return state;
  }
};

//------------------------------------------------------------------------------

//Action Creators
const addAnnotationPoint = (x, y, frame) => {
  return (dispatch) => {
    dispatch({
      type: ADD_ANNOTATION_POINT,
      x, y, frame
    });
  };
};

const selectAnnotation = (index, previousAnnotation) => {
  return (dispatch, getState) => {
    let annotation;

    if (previousAnnotation) {
      annotation = getState().previousAnnotations.marks[index];
    } else {
      annotation = getState().annotations.annotations[index];
    }
    dispatch({
      type: SELECT_ANNOTATION,
      annotation,
      index,
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

const updateText = (text) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_TEXT,
      text
    });
  };
};

const collaborateWithAnnotation = (annotation, text) => {
  return (dispatch) => {
    dispatch({
      type: COLLABORATE_WITH_ANNOTATION,
      annotation, text
    });
  };
};

export default subjectReducer;

//------------------------------------------------------------------------------

//Exports

export {
  addAnnotationPoint, completeAnnotation,
  selectAnnotation, unselectAnnotation,
  collaborateWithAnnotation,
  updateText, ANNOTATION_STATUS
};
