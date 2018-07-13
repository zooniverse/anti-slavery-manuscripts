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

import { fetchWorkflow } from './workflow';
import { fetchSavedSubject, prepareForNewSubject, setSubjectId } from './subject';
import { setAnnotations } from './annotations';
import { setVariant } from './splits';

const SUBJECT_ID_KEY = 'emergency_save_subjectId';
const WORKFLOW_ID_KEY = 'emergency_save_workflowId';
const ANNOTATIONS_KEY = 'emergency_save_annotations';
const VARIANT_KEY = 'emergency_save_variant';
const ANONYMOUS_USER_ID = 'anonymous';

function checkEmergencySave(user) {
  const userId = (user) ? user.id : ANONYMOUS_USER_ID;
  const subjectId = localStorage.getItem(`${userId}.${SUBJECT_ID_KEY}`);
  const workflowId = localStorage.getItem(`${userId}.${WORKFLOW_ID_KEY}`);
  const annotations = localStorage.getItem(`${userId}.${ANNOTATIONS_KEY}`);

  return !!subjectId && !!workflowId && !!annotations;
}

const emergencySaveWorkInProgress = () => {
  return (dispatch, getState) => {
    const subjectId = getState().subject.id;
    const workflowId = getState().workflow.id;
    const annotations = getState().annotations.annotations;
    const variant = getState().splits.variant;

    if (subjectId !== null) {      
      const userId = (getState().login.user) ? getState().login.user.id : ANONYMOUS_USER_ID;
      localStorage.setItem(`${userId}.${SUBJECT_ID_KEY}`, subjectId);
      localStorage.setItem(`${userId}.${WORKFLOW_ID_KEY}`, workflowId);
      localStorage.setItem(`${userId}.${ANNOTATIONS_KEY}`, JSON.stringify(annotations));
      localStorage.setItem(`${userId}.${VARIANT_KEY}`, variant);
    }

    console.info('emergencySaveWorkInProgress()');
    Rollbar && Rollbar.info &&
    Rollbar.info('emergencySaveWorkInProgress()');
  };
};

const emergencyLoadWorkInProgress = () => {
  return (dispatch, getState) => {
    try {
      const userId = (getState().login.user) ? getState().login.user.id : ANONYMOUS_USER_ID;
      const subjectId = localStorage.getItem(`${userId}.${SUBJECT_ID_KEY}`);  //TODO: Check if a type conversion is required.
      const workflowId = localStorage.getItem(`${userId}.${WORKFLOW_ID_KEY}`);  //TODO: Check if a type conversion is required.
      const annotations = JSON.parse(localStorage.getItem(`${userId}.${ANNOTATIONS_KEY}`));
      const variant = localStorage.getItem(`${userId}.${VARIANT_KEY}`);
      
      console.log('+++ EMERGENCY LOAD: ', userId, subjectId, workflowId, annotations, variant);
      
      dispatch(fetchWorkflow(workflowId)).then(() => {
        dispatch(fetchSavedSubject(subjectId))        
        .then(() => {
          prepareForNewSubject(dispatch, null);
          dispatch(setAnnotations(annotations));  //Note: be sure to set Annotations AFTER prepareForNewSubject().
          dispatch(setVariant(variant));
          dispatch(clearEmergencySave());
        });
      });
      
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
  return (dispatch, getState) => {
    const userId = (getState().login.user) ? getState().login.user.id : ANONYMOUS_USER_ID;
    localStorage.removeItem(`${userId}.${SUBJECT_ID_KEY}`);
    localStorage.removeItem(`${userId}.${ANNOTATIONS_KEY}`);
  }
};

export {
  checkEmergencySave,
  emergencySaveWorkInProgress,
  emergencyLoadWorkInProgress,
  clearEmergencySave,
};
