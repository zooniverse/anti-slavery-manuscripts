/*
Dialog Of Failure
-----------------
ASM has a special problem: sometimes, when a user is working on a document for
too long, their login session dies. When this happens, this message kicks in.
The larger safety mechanism can be found in the root App.
 */

import React from 'react';

const DialogOfFailure = () => {
  return (
    <div className="classification-prompt">
      <h2>Systems Error</h2>
      <span>
        An unexpected error was encountered; quite possibly, your login session
        was lost and you may need to reload the page and log in again.
      </span>
      <span>
        Your work in progress has been saved, however, and you can resume your
        work after reloading.
      </span>
    </div>
  );
};

export default DialogOfFailure;
