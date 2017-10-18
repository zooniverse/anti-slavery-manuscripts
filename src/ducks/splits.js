import { Split } from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client.js';

const FETCH_SPLIT = 'FETCH_SPLIT';
const CLEAR_SPLITS = 'CLEAR_SPLITS';
const TOGGLE_OVERRIDE = 'TOGGLE_OVERRIDE';

const initialState = {
  adminOverride: false,
  data: null
};

const splitReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPLIT:
      return Object.assign({}, state, {
        data: action.splits,
      });

    case TOGGLE_OVERRIDE:
      return Object.assign({}, state, {
        adminOverride: action.option
      });

    case CLEAR_SPLITS:
      return Object.assign({}, state, {
        data: null
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

const clearSplits = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_SPLITS,
    });
  };
}

const toggleOverride = () => {
  return (dispatch, getState) => {
    const option = !getState().splits.adminOverride;
    dispatch({
      type: TOGGLE_OVERRIDE,
      option
    });
  };
}

// Exports
export default splitReducer;

export {
  clearSplits,
  fetchSplit,
  toggleOverride
};
