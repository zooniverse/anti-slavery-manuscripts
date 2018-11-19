const CLEAR_SPLITS = 'CLEAR_SPLITS';
const TOGGLE_VARIANT = 'TOGGLE_VARIANT';
const SET_VARIANT = 'SET_VARIANT';

const VARIANT_TYPES = {
  INDIVIDUAL: 'individual',
  COLLABORATIVE: 'collaborative',
};

const initialState = {
  variant: VARIANT_TYPES.COLLABORATIVE,
  data: null,
  id: null,
};

const splitReducer = (state = initialState, action) => {
  switch (action.type) {
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
  toggleVariant,
  setVariant,
  VARIANT_TYPES
};
