/*
Dialog Of Continuation
-----------------
ASM has a special problem: sometimes, when a user is working on a document for
too long, their login session dies. Fortunately, we have an Emergency Save
system that saves the user's work and lets them resume. This dialog informs
them that their progress has been restored.
 */

import React from 'react';
import { clearEmergencySave } from '../ducks/emergency-save';

const DialogOfContinuation = ({ dispatch, onClose }) => {
  console.log('x'.repeat(100), dispatch);
  return (
    <div className="classification-prompt">
      <h2>Resuming Work</h2>
      <span>
        We detected that you encountered a problem recently, and have restored
        your work in progress. You can continue your saved work, or start with
        a new manuscript. Thank you for your patience.
      </span>
      <div>
        <button
          className="button"
          onClick={(e) => {
            dispatch(clearEmergencySave());
            location.reload();
          }}
        >
          New Manuscript
        </button>
        <button
          className="button"
          onClick={(e) => { onClose && onClose(e); }}
        >
          Continue Saved
        </button>
      </div>
    </div>
  );
};

export default DialogOfContinuation;
