import { combineReducers } from 'redux';
import login from './login';
import collections from './collections';
import project from './project';
import subject from './subject';
import subjectViewer from './subject-viewer';
import annotations from './annotations';
import dialog from './dialog';
import previousAnnotations from './previousAnnotations';
import workflow from './workflow';
import classifications from './classifications';
import splits from './splits';
import fieldGuide from './field-guide';
import tutorial from './tutorial';

export default combineReducers({
  login,
  collections,
  project,
  subject,
  subjectViewer,
  annotations,
  dialog,
  previousAnnotations,
  workflow,
  classifications,
  splits,
  fieldGuide,
  tutorial
});
