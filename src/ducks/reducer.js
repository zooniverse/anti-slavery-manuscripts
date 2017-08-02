import { combineReducers } from 'redux';
import login from './login';
import collections from './collections';
import project from './project';
import subject from './subject';
import subjectViewer from './subject-viewer';

export default combineReducers({
  login,
  collections,
  project,
  subject,
  subjectViewer,
});
