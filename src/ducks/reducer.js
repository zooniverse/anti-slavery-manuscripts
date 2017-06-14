import { combineReducers } from 'redux';
import login from './login';
import classifier from './classifier';

export default combineReducers({
  login,
  classifier
});
