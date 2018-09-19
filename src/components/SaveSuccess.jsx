import React from 'react';
import PropTypes from 'prop-types';

const SaveSuccess = ({ onClose }) => {
  return (
    <div className="save-confirm">
      <h3>Save Success!</h3>
      <span>
        Your work-in-progress has been saved. As long as you&apos;re logged in, you
        can visit this page again at a later time to continue where you left off.
      </span>
      <span>
        Please be aware that other volunteers may be working on the same
        subject in parallel. If the subject is retired by others before you have
        finished your submission, you will not be able to return to your
        locally-saved work.
      </span>
      <button className="confirm-button" type="submit" onClick={onClose}>OK</button>
    </div>

  );
};

SaveSuccess.propTypes = {
  onClose: PropTypes.func,
};

export default SaveSuccess;
