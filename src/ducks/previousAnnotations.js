import { request } from 'graphql-request';
import { constructCoordinates, constructText } from '../lib/construct-previous-annotations';

const initialState = {
 data: null,
 marks: [],
 selectedPreviousAnnotation: null
};

const TEMP_WORKFLOW_ID = '3017';
const TEMP_SUBJECT_ID = '72815';
const CAESAR_HOST = 'https://caesar-staging.zooniverse.org/graphql';

const FETCH_ANNOTATIONS = 'FETCH_ANNOTATIONS';
const UPDATE_FRAME ='UPDATE_FRAME';
const UPDATE_PREVIOUS_ANNOTATION = 'UPDATE_PREVIOUS_ANNOTATION';

const previousAnnotationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ANNOTATIONS:
      return Object.assign({}, state, {
        data: action.data,
        marks: action.marks
      });

    case UPDATE_FRAME:
      return Object.assign({}, state, {
        marks: action.marks
      });

    case UPDATE_PREVIOUS_ANNOTATION:
      const marks = state.marks.slice();
      const updatedAnnotation = marks[action.index];
      updatedAnnotation.hasCollaborated = true;

      return Object.assign({}, state, {
        marks
      });

   default:
     return state;
 };
};

const fetchAnnotations = () => {
  const query = `{
    workflow(id: ${TEMP_WORKFLOW_ID}) {
      reductions(subjectId: ${TEMP_SUBJECT_ID}) {
        data
      }
    }
  }`;

  return (dispatch, getState) => {
    request(CAESAR_HOST, query).then((data) => {
      console.log(data);
      const frame = getState().subjectViewer.frame;
      const reductions = data.workflow.reductions;
      const marks = constructAnnotations(reductions, frame);

      dispatch({
        type: FETCH_ANNOTATIONS,
        data: data.workflow.reductions,
        marks
      });
    });
  };
};

const updatePreviousAnnotation = (index) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PREVIOUS_ANNOTATION,
      index,
    });
  };
};

const changeFrameData = (index) => {
  return (dispatch, getState) => {
    const data = getState().previousAnnotations.data;
    const marks = constructAnnotations(data, index);
    dispatch({
      type: UPDATE_FRAME,
      marks
    });
  };
};


const constructAnnotations = (reductions, frame) => {
  const clusteredAnnotations = reductions || [];
  let previousAnnotations = [];
  clusteredAnnotations.map((reduction) => {
    const currentFrameAnnotations = reduction.data[`frame${frame}`];

    if (currentFrameAnnotations) {
      currentFrameAnnotations.map((annotation, i) => {
        const points = constructCoordinates(annotation);
        const textOptions = constructText(annotation, i);
        const data = {
          points, frame, textOptions,
          previousAnnotation: true,
          hasCollaborated: false,
        };
        previousAnnotations.push(data);
      })
    }
  })
  return previousAnnotations;
};

export default previousAnnotationsReducer;

export {
  changeFrameData,
  fetchAnnotations,
  updatePreviousAnnotation
};
