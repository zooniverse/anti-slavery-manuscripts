import apiClient from 'panoptes-client/lib/api-client.js';
import { config } from '../config';

const FETCH_GUIDE = 'FETCH_GUIDE';

const initialState = {
  icons: null,
  guide: null
};

const fieldGuideReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_GUIDE:
      return Object.assign({}, state, {
        guide: action.guide,
        icons: action.icons
      });

    default:
      return state;
  }
};

const fetchGuide = () => {
  return (dispatch, getState) => {
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
        type: FETCH_GUIDE,
        icons,
        guide
      });
    });
  };
};

export default fieldGuideReducer;

export {
  fetchGuide,
};
