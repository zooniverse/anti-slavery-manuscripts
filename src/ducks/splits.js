import { Split } from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client.js';

const FETCH_SPLIT = 'FETCH_SPLIT';

const initialState = {
 data: null
};

const splitReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPLIT:
      return Object.assign({}, state, {
        data: action.splits,
      });

    default:
      return state;
 };
};

const fetchSplit = (user) => {
  return (dispatch) => {
    Split.load("wgranger-test/anti-slavery-testing").then((splits) => {
      dispatch({
        type: FETCH_SPLIT,
        splits
      });
    })
    .catch((err) => {
    })
  }
};

// Exports
export default splitReducer;

export {
 fetchSplit,
};
