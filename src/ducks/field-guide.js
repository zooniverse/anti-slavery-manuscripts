import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';

const FETCH_GUIDE = 'FETCH_GUIDE';
const FETCH_GUIDE_SUCCESS = 'FETCH_GUIDE_SUCCESS';
const FETCH_GUIDE_ERROR = 'FETCH_GUIDE_ERROR';

const GUIDE_STATUS = {
  IDLE: 'guide_status_idle',
  FETCHING: 'guide_status_fetching',
  READY: 'guide_status_ready',
  ERROR: 'guide_status_error',
};

const initialState = {
  status: GUIDE_STATUS.IDLE,
  icons: {},
  guide: {}
};

const fieldGuideReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_GUIDE:
      return Object.assign({}, state, {
        status: GUIDE_STATUS.FETCHING
      });

    case FETCH_GUIDE_SUCCESS:
      return Object.assign({}, state, {
        status: GUIDE_STATUS.READY,
        guide: action.guide,
        icons: action.icons
      });

    case FETCH_GUIDE_ERROR:
      return Object.assign({}, state, {
        status: GUIDE_STATUS.ERROR
      });

    default:
      return state;
  }
};

const fetchGuide = () => {
  return (dispatch, getState) => {

    dispatch({
      type: FETCH_GUIDE,
    });

    apiClient.type('field_guides').get({ project_id: `${config.zooniverseLinks.projectId}` }).then(([guide]) => {
      let icons = {};

      if (guide) {
        guide.get('attached_images', { page_size: 100 }).then((images) => {
          images.map((image) => {
            icons[image.id] = image;
          });
        });
      }

      dispatch({
        type: FETCH_GUIDE_SUCCESS,
        icons,
        guide
      });
    })
    .catch((err) => {
      dispatch({ type: FETCH_GUIDE_ERROR });
    });
  };
};

export default fieldGuideReducer;

export {
  fetchGuide,
  GUIDE_STATUS
};
