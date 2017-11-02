import { Split } from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';

const FETCH_SPLIT = 'FETCH_SPLIT';
const FETCH_SPLIT_SUCCESS = 'FETCH_SPLIT_SUCCESS';
const FETCH_SPLIT_ERROR = 'FETCH_SPLIT_ERROR';
const CLEAR_SPLITS = 'CLEAR_SPLITS';
const TOGGLE_OVERRIDE = 'TOGGLE_OVERRIDE';


const SPLIT_STATUS = {
  IDLE: 'split_status_idle',
  FETCHING: 'split_status_fetching',
  READY: 'split_status_ready',
  ERROR: 'split_status_error',
};

const VARIANT_TYPES = {
  INDIVIDUAL: 'individual',
  COLLABORATIVE: 'collaborative'
};

const initialState = {
  adminOverride: false,
  variant: VARIANT_TYPES.INDIVIDUAL,
  data: null,
  id: null
};

const splitReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPLIT:
      return Object.assign({}, state, {
        status: SPLIT_STATUS.FETCHING,
      })

    case FETCH_SPLIT_SUCCESS:
      return Object.assign({}, state, {
        status: SPLIT_STATUS.READY,
        variant: action.variant,
        data: action.splits,
        id: action.id
      });

    case FETCH_SPLIT_ERROR:
      return Object.assign({}, state, {
        status: SPLIT_STATUS.ERROR,
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

    dispatch({
      type: FETCH_SPLIT,
    });

    Split.load(config.projectSlug).then((splits) => {
      let variant = VARIANT_TYPES.INDIVIDUAL;

      const split = splits && splits['classifier.collaborative'];
      const id = split && split.id;
      const hasElementKey = split && 'div' in split.variant.value;
      const isShown = split && split.variant.value['div'];

      if (!split || isShown || !hasElementKey) {
        variant = VARIANT_TYPES.COLLABORATIVE;
      }

      dispatch({
        type: FETCH_SPLIT_SUCCESS,
        id, variant, splits
      });
    })
    .catch((err) => {
      dispatch({ type: FETCH_SPLIT_ERROR });
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
  toggleOverride,
  SPLIT_STATUS,
  VARIANT_TYPES
};
