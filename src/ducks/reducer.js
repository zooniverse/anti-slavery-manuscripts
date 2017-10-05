import { combineReducers } from 'redux';
import login from './login';
import collections from './collections';
import project from './project';
import subject from './subject';
import subjectViewer from './subject-viewer';
import annotations from './annotations';
import dialog from './dialog';
import aggregations from './aggregations';
import splits from './splits';

export default combineReducers({
  login,
  collections,
  project,
  subject,
  subjectViewer,
  annotations,
  dialog,
  aggregations,
  splits
});
