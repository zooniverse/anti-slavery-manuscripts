import { request, GraphQLClient } from 'graphql-request';

const initialState = {
 data: null,
 selectedPreviousAnnotation: null
};

const TEMP_WORKFLOW_ID = '3017';
const TEMP_SUBJECT_ID = '72815';
const CAESAR_HOST = 'https://caesar-staging.zooniverse.org/graphql';

const FETCH_AGGREGATIONS = 'FETCH_AGGREGATIONS';

const aggregationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AGGREGATIONS:
      return {
       data: action.data
      };

   default:
     return state;
 };
};

const fetchAggregations = () => {
  const query = `{
    workflow(id: ${TEMP_WORKFLOW_ID}) {
      reductions(subjectId: ${TEMP_SUBJECT_ID}) {
        data
      }
    }
  }`;

  return (dispatch, getState) => {
    request(CAESAR_HOST, query).then((result) => {
      dispatch({
        type: FETCH_AGGREGATIONS,
        data: result.workflow.reductions
      });
    });
  };
};

export default aggregationReducer;

export {
  fetchAggregations,
};
