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
        An unexpected error has occurred, and your login session was lost.
      </span>
      <span>
        Your work in progress has been saved. Please reload the page and log
        in to your account. You will then be able to resume your work.
      </span>
      <div>
        <button
          className="button"
          onClick={(e) => { location.reload(); }}
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

export default DialogOfFailure;
