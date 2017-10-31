import React from 'react';
import PropTypes from 'prop-types';

class LoadingSpinner extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="words">
          <h1>loading</h1>
          <hr />
        </div>
      </div>
    );
  }
}

export default LoadingSpinner;
