import oauth from 'panoptes-client/lib/oauth';
import * as types from '../constants/actionTypes';

export function setLoginUser(user) {
  return (dispatch) => {
    dispatch({
      type: types.SET_LOGIN_USER,
      user,
    });
  };
}

export function checkLoginUser() {  // First thing on app load - check if the user is logged in.
  return (dispatch) => {
    oauth.checkCurrent()
      .then((user) => {
        dispatch(setLoginUser(user));
      });
  };
}

function computeRedirectURL(window) {
  return window.location.origin ||
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
}

export function loginToPanoptes() {  // Returns a login page URL for the user to navigate to.
  return (() => oauth.signIn(computeRedirectURL(window)));
}

export function logoutFromPanoptes() {
  return (dispatch) => {
    oauth.signOut()
      .then((user) => {
        dispatch(setLoginUser(user));
      });
  };
}
