import { fetchSavedSubject, prepareForNewSubject } from './subject';
import { setAnnotations } from './annotations';

function checkEmergencySave() {
  const subjectId = localStorage.getItem(SUBJECT_ID_KEY);
  const annotations = localStorage.getItem(ANNOTATIONS_KEY);

  return !!subjectId && !!annotations;
}

const SUBJECT_ID_KEY = 'emergency_save_subjectId';
const ANNOTATIONS_KEY = 'emergency_save_subjectId';

const emergencySaveWorkInProgress = () => {
  return (dispatch, getState) => {
    const subjectId = getState().subject.id;
    const annotations = getState().annoations.annotations;
    
    localStorage.saveItem(SUBJECT_ID_KEY, JSON.stringify(subjectId));
    localStorage.saveItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
  };
};

const emergencyLoadWorkInProgress = () => {
  return (dispatch, getState) => {
    try {
      const subjectId = localStorage.getItem(SUBJECT_ID_KEY);
      const annotations = localStorage.getItem(ANNOTATIONS_KEY);
      dispatch(fetchSavedSubject(subjectId));
      dispatch(prepareForNewSubject());
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
