/*
Emergency Save Work In Progress
-------------------------------
ASM has a special problem: sometimes, when a user is working on a document for
too long, their login session dies. When this happens, their work is saved in
local storage, so they can continue where they left off after refreshing the
page (and refreshing their login state).

NOTE: This emergecy system does NOT care which account the user is logged in to
when they save their work, and later resume their work. This system isn't trying
to be smart, it's a blunt instrument acting as a safety net when the user's Save
Progress and Panoptes Client's token auto-refresh fails.
 */

import { fetchSavedSubject, prepareForNewSubject } from './subject';
import { setAnnotations } from './annotations';

const SUBJECT_ID_KEY = 'emergency_save_subjectId';
const ANNOTATIONS_KEY = 'emergency_save_annotations';

function checkEmergencySave() {
  const subjectId = localStorage.getItem(SUBJECT_ID_KEY);
  const annotations = localStorage.getItem(ANNOTATIONS_KEY);

  return !!subjectId && !!annotations;
}

const emergencySaveWorkInProgress = () => {
  return (dispatch, getState) => {
    const subjectId = getState().subject.id;
    const annotations = getState().annotations.annotations;

    if (subjectId !== null) {
      localStorage.setItem(SUBJECT_ID_KEY, subjectId);
      localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
    }

    console.info('emergencySaveWorkInProgress()');
    Rollbar && Rollbar.info &&
    Rollbar.info('emergencySaveWorkInProgress()');
  };
};

const emergencyLoadWorkInProgress = () => {
  return (dispatch, getState) => {
    try {
      const subjectId = localStorage.getItem(SUBJECT_ID_KEY);  //TODO: Check if a type conversion is required.
      const annotations = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY));
      dispatch(fetchSavedSubject(subjectId));
      prepareForNewSubject(dispatch, null);
      dispatch(setAnnotations(annotations));  //Note: be sure to set Annotations AFTER prepareForNewSubject().

      console.info('emergencyLoadWorkInProgress()');
      Rollbar && Rollbar.info &&
      Rollbar.info('emergencyLoadWorkInProgress()');
    } catch (err) {
      console.error('emergencyLoadWorkInProgress() error: ', err);
      Rollbar && Rollbar.error &&
      Rollbar.error('emergencyLoadWorkInProgress() error: ', err);
    }
  };
};

const clearEmergencySave = () => {
  localStorage.removeItem(SUBJECT_ID_KEY);
  localStorage.removeItem(ANNOTATIONS_KEY);
};

export {
  checkEmergencySave,
  emergencySaveWorkInProgress,
  emergencyLoadWorkInProgress,
  clearEmergencySave,
};
