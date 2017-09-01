/*
Redux Duck: Annotations
-------------------

...

 */

//Action Types
const ADD_ANNOTATION_POINT = 'ADD_ANNOTATION_POINT';
const COMPLETE_ANNOTATION = 'COMPLETE_ANNOTATION';
const SELECT_ANNOTATION = 'SELECT_ANNOTATION';
const SELECT_PREVIOUS_ANNOTATION = 'SELECT_PREVIOUS_ANNOTATION';
const UNSELECT_ANNOTATION = 'UNSELECT_ANNOTATION';
const UNSELECT_PREVIOUS_ANNOTATION = 'UNSELECT_PREVIOUS_ANNOTATION';
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
  endClicks: [],
  previousAnnotationSelected: false,
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
      const endClicks = (state.endClicks) ? state.endClicks.splice(0) : [];
      endClicks.push(action.endPoint);
      return Object.assign({}, state, {
        status: ANNOTATION_STATUS.IDLE,
        annotationInProgress: null,
        annotations,
        endClicks,
        annotationPanePosition: action.endPoint,
        selectedAnnotation: state.annotationInProgress,  //Auto-select latest annotation.
        selectedAnnotationIndex: annotations.length - 1
      });

    case SELECT_PREVIOUS_ANNOTATION:
      return Object.assign({}, state, {
        annotationPanePosition: action.data.points[0],
        previousAnnotationSelected: true,
        selectedAnnotation: action.data,
      });

    case SELECT_ANNOTATION:
      const selectedAnnotation = (state.annotations && state.annotations[action.index])
        ? state.annotations[action.index]
        : null;
      const annotationPanePosition = (state.endClicks && state.endClicks[action.index])
        ? state.endClicks[action.index]
        : null;
      return Object.assign({}, state, {
        selectedAnnotation,
        annotationPanePosition,
        selectedAnnotationIndex: action.index
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

    case UNSELECT_PREVIOUS_ANNOTATION:
      return Object.assign({}, state, {
        annotationPanePosition: null,
        previousAnnotationSelected: false,
        selectedAnnotation: null
      });

    default:
      return state;
  }
};

//------------------------------------------------------------------------------

//Action Creators
const selectPreviousAnnotation = (data) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_PREVIOUS_ANNOTATION,
      data
    });
  };
};

const addAnnotationPoint = (x, y, frame) => {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_ANNOTATION_POINT,
      x, y, frame
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

const unselectPreviousAnnotation = () => {
  return (dispatch) => {
    dispatch({
      type: UNSELECT_PREVIOUS_ANNOTATION,
    });
  };
};

const completeAnnotation = (endPoint) => {
  return (dispatch) => {
    dispatch({
      type: COMPLETE_ANNOTATION,
      endPoint,
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

export default subjectReducer;

//------------------------------------------------------------------------------

//Exports

export {
  addAnnotationPoint, completeAnnotation,
  selectAnnotation, unselectAnnotation,
  unselectPreviousAnnotation, selectPreviousAnnotation,
  updateText, ANNOTATION_STATUS
};
