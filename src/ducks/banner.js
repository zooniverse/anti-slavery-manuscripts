const initialState = {
  show: true,
};

const DISABLE_BANNER = 'DISABLE_BANNER';

const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISABLE_BANNER:
      return {
        show: false,
      };

    default:
      return state;
  }
};

const disableBanner = () => {
  return (dispatch) => {
    dispatch({
      type: DISABLE_BANNER,
    });
  };
};

export default bannerReducer;

export {
  disableBanner,
};
