import { combineReducers } from 'redux';
import login from './login';
import project from './project';

export default combineReducers({
  login,
  project,
});
