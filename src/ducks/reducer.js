import { combineReducers } from 'redux';
import login from './login';
import project from './project';
import subject from './subject';

export default combineReducers({
  login,
  project,
  subject,
});
