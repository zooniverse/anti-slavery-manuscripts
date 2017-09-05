import { request, GraphQLClient } from 'graphql-request';

const initialState = {
 data: null
};

const TEMP_WORKFLOW_ID = '3017';
const TEMP_SUBJECT_ID = '72815';
const CAESAR_HOST = 'https://caesar-staging.zooniverse.org/graphql';

const FETCH_AGGREGATIONS = 'FETCH_AGGREGATIONS';

const aggregationReducer = (state = initialState, action) => {
 switch (action.type) {
   case FETCH_AGGREGATIONS:
     return 'testing'
   default:
     return state;
 };
};

const fetchAggregations = () => {
  const client = new GraphQLClient(CAESAR_HOST, {
    mode: 'no-cors'
  })

  const query = `{
    workflow(id: 2828) {
      reductions(subjectID: ${TEMP_SUBJECT_ID}) {
        data
      }
    }
  }`;

  client.request(CAESAR_HOST, query).then((result) => {
    console.log('WE GET TO THIS POINT');
    console.log(result);
  });

  return (dispatch, getState) => {
   dispatch({
     type: FETCH_AGGREGATIONS
   });
  };
};

export default aggregationReducer;

export {
  fetchAggregations
};
