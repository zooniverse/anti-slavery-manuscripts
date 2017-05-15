import * as types from '../constants/actionTypes';

const initialState = { user: null, initialised: false };

export function login(state = initialState, action) { // eslint-disable-line import/prefer-default-export
  switch (action.type) {
    case types.SET_LOGIN_USER:
      return {
        user: action.user,  // null if logged out.
        initialised: true,  // true once we know if user is logged in/out; false if unknown.
      };
    default:
      return state;
  }
}
