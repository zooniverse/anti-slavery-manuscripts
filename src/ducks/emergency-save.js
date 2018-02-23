import { fetchSavedSubject, prepareForNewSubject } from './subject';
import { setAnnotations } from './annotations';

function checkEmergencySave() {
  const subjectId = localStorage.getItem(SUBJECT_ID_KEY);
  const annotations = localStorage.getItem(ANNOTATIONS_KEY);

  return !!subjectId && !!annotations;
}

const SUBJECT_ID_KEY = 'emergency_save_subjectId';
const ANNOTATIONS_KEY = 'emergency_save_annotations';

const emergencySaveWorkInProgress = () => {
  return (dispatch, getState) => {
    const subjectId = getState().subject.id;
    const annotations = getState().annotations.annotations;
    
    localStorage.setItem(SUBJECT_ID_KEY, subjectId);
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
  };
};

const emergencyLoadWorkInProgress = () => {
  return (dispatch, getState) => {
    try {
      const subjectId = localStorage.getItem(SUBJECT_ID_KEY);  //TODO: Check if a type conversion is required.
      const annotations = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY));
      dispatch(fetchSavedSubject(subjectId));
      prepareForNewSubject(dispatch, null);
      dispatch(setAnnotations(annotations));
    } catch (err) {
      console.error('emergencyLoadWorkInProgress() error: ', err);
    }
  };
};

export {
  checkEmergencySave,
  emergencySaveWorkInProgress,
  emergencyLoadWorkInProgress,
};
