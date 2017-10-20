import { request } from 'graphql-request';
import { constructCoordinates, constructText } from '../lib/construct-previous-annotations';
import { config, CONSENSUS_SCORE } from '../config.js';

const initialState = {
 data: null,
 marks: [],
 selectedPreviousAnnotation: null
};

const TEMP_SUBJECT_ID = '72815';
const CAESAR_HOST = 'https://caesar-staging.zooniverse.org/graphql';

const FETCH_ANNOTATIONS = 'FETCH_ANNOTATIONS';
const UPDATE_FRAME ='UPDATE_FRAME';
const UPDATE_PREVIOUS_ANNOTATION = 'UPDATE_PREVIOUS_ANNOTATION';
const REENABLE_PREVIOUS_ANNOTATION = 'REENABLE_PREVIOUS_ANNOTATION';

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

    case REENABLE_PREVIOUS_ANNOTATION:
      //Find the Previous (Aggregated) Annotation that matches the Selected Annotation, then reenable it.
      const reenabledMarks = state.marks.map((item) => {
        let isAMatch =  //First check: does the current Previous Annotation and the Selected Annotation look remotely similar?
          item.hasCollaborated && item.points &&
          action.selectedAnnotation && action.selectedAnnotation.points &&
          item.points.length === action.selectedAnnotation.points.length;

        if (isAMatch) {  //Second check: do all the x-y coordinates that make the line match up?
          item.points.map((a, index) => {
            const b = action.selectedAnnotation.points[index];
            isAMatch = isAMatch && a.x === b.x && a.y === b.y;
          });
        }

        //Finally, reenable the Previous Annotation if it's a match.
        if (isAMatch) item.hasCollaborated = false;

        //WARNING: This is a fairly primitive method of reenabling the previous
        //Annotation, and will not work if the user-created Annotation can have
        //its x-y coordinates edited.

        return item;
      });

      return Object.assign({}, state, {
        marks: reenabledMarks,
      });

   default:
     return state;
 };
};

const fetchAnnotations = (subject) => {
  const query = `{
    workflow(id: ${config.zooniverseLinks.workflowId}) {
      reductions(subjectId: ${subject.id}) {
        data
      }
    }
  }`;

  return (dispatch, getState) => {
    request(CAESAR_HOST, query).then((data) => {
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

/*  When an Agreement Annotation (that was based on a Previous Annotation) is
    deleted, attempt to re-enable that Previous Annotation.
 */
const reenablePreviousAnnotation = () => {
  return (dispatch, getState) => {
    const selectedAnnotation = getState().annotations.selectedAnnotation;
    dispatch({
      type: REENABLE_PREVIOUS_ANNOTATION,
      selectedAnnotation,
    });
  };
}

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
          consensusReached: annotation.consensus_score >= CONSENSUS_SCORE,
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
  updatePreviousAnnotation,
  reenablePreviousAnnotation,
};
