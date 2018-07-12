import apiClient from 'panoptes-client/lib/api-client.js';
import oauth from 'panoptes-client/lib/oauth';
import { fetchPreferences, setUserRoles } from './project';
import { config } from '../config';

// Action Types
const SET_LOGIN_USER = 'project/user/SET_LOGIN_USER';

// Reducer
const initialState = {
  user: null,
  initialised: false,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_USER:
      return Object.assign({}, state, {
        user: action.user,  // null if logged out.
        initialised: true,  // true once we know if user is logged in/out; false if unknown.
      });

    default:
      return state;
  }
};

// Action Creators
const checkLoginUser = () => {
 // First thing on app load - check if the user is logged in.
  return (dispatch) => {
    oauth.checkCurrent()
      .then((user) => {
        dispatch(setLoginUser(user));
      });
  };
};

const loginToPanoptes = () => {
 // Returns a login page URL for the user to navigate to.
 return (() => oauth.signIn(computeRedirectURL(window)));
};

const logoutFromPanoptes = () => {
  return (dispatch) => {
    oauth.signOut()
      .then((user) => {
        dispatch(setLoginUser(user));
      });
  };
};

const setLoginUser = (user) => {
  return (dispatch) => {
    console.info('ducks/login.js setLoginUser(): user ', user, ', user.id ', (user && user.id));
    if (user) {
      apiClient.type('project_roles').get({ project_id: config.zooniverseLinks.projectId, user_id: user.id })
        .then(([userRoles]) => {
          if (userRoles) {
            dispatch(setUserRoles(userRoles.roles));
          }
        })
        .catch((err) => {
          console.error('ducks/login.js setLoginUser() error: ', err);
        });
    }

    dispatch({
      type: SET_LOGIN_USER,
      user,
    });

    dispatch(fetchPreferences(user));
  };
};

// Helper functions
const computeRedirectURL = (window) => {
  const { location } = window;
  return location.origin ||
    `${location.protocol}//${location.hostname}:${location.port}`;
};

// Exports
export default loginReducer;

export {
  checkLoginUser,
  loginToPanoptes,
  logoutFromPanoptes,
  setLoginUser,
};
