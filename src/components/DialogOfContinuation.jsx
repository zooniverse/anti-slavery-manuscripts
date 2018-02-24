/*
Dialog Of Continuation
-----------------
ASM has a special problem: sometimes, when a user is working on a document for
too long, their login session dies. Fortunately, we have an Emergency Save
system that saves the user's work and lets them resume. This dialog informs
them that their progress has been restored.
 */

import React from 'react';

const DialogOfContinuation = () => {
  return (
    <div className="classification-prompt">
      <h2>Resuming Work</h2>
      <span>
        We detected that you encountered a problem recently, and have restored
        your work in progress. Thank you for your patience.
      </span>
    </div>
  );
};

export default DialogOfContinuation;
