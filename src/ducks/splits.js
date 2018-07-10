import { Split } from 'seven-ten';
import { config } from '../config';
//NOPE import { fetchWorkflow } from './workflow';

const FETCH_SPLIT = 'FETCH_SPLIT';
const FETCH_SPLIT_SUCCESS = 'FETCH_SPLIT_SUCCESS';
const FETCH_SPLIT_ERROR = 'FETCH_SPLIT_ERROR';
const CLEAR_SPLITS = 'CLEAR_SPLITS';
const TOGGLE_VARIANT = 'TOGGLE_VARIANT';
const SET_VARIANT = 'SET_VARIANT';


const SPLIT_STATUS = {
  IDLE: 'split_status_idle',
  FETCHING: 'split_status_fetching',
  READY: 'split_status_ready',
  ERROR: 'split_status_error',
};

const VARIANT_TYPES = {
  INDIVIDUAL: 'individual',
  COLLABORATIVE: 'collaborative',
};

const initialState = {
  variant: VARIANT_TYPES.INDIVIDUAL,
  data: null,
  id: null,
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

    case TOGGLE_VARIANT:
      return Object.assign({}, state, {
        variant: action.variant
      });

    case CLEAR_SPLITS:
      return Object.assign({}, state, {
        data: null
      });

    case SET_VARIANT:
      return Object.assign({}, state, {
        variant: action.variant
      });

    default:
      return state;
 };
};

/* //NOPE const fetchSplit = (user) => {
  return (dispatch) => {
    let variant = VARIANT_TYPES.INDIVIDUAL;

    dispatch({
      type: FETCH_SPLIT,
    });

    if (user) {
      Split.load(config.zooniverseLinks.projectSlug).then((splits) => {
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
        dispatch(fetchWorkflow(variant));
      })
      .catch((err) => {
        console.error('ducks/splits.js fetchSplit() error: ', err);
        dispatch({ type: FETCH_SPLIT_ERROR });
        dispatch(fetchWorkflow(variant));
      })
    } else {
      dispatch({
        type: FETCH_SPLIT_SUCCESS,
        id: null,
        variant: VARIANT_TYPES.INDIVIDUAL,
        data: null
      });
      dispatch(fetchWorkflow(variant));
    }
  };
};*/

const clearSplits = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_SPLITS,
    });
  };
};

const toggleVariant = (currentVariant) => {
  return (dispatch, getState) => {
    const variant = currentVariant === VARIANT_TYPES.INDIVIDUAL ? VARIANT_TYPES.COLLABORATIVE : VARIANT_TYPES.INDIVIDUAL;
    dispatch({
      type: TOGGLE_VARIANT,
      variant,
    });
  };
};

const setVariant = (variant) => {
  return (dispatch) => {
    dispatch({
      type: SET_VARIANT,
      variant,
    });
  };
};

// Exports
export default splitReducer;

export {
  clearSplits,
  //NOPE fetchSplit,
  toggleVariant,
  setVariant,
  SPLIT_STATUS,
  VARIANT_TYPES
};
