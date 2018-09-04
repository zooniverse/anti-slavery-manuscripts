import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({ hideBanner }) => {
  // If no messages, just return null.
  // return null;

  return (
    <div className="top-banner">
      <h2>
        Thank you for participating! We appreciate any feedback for our workflow selection option
        <a href="https://goo.gl/forms/j7HaJMMTPkV4kd5w2" target="blank" rel="noopener noreferrer">here</a>.
      </h2>
      <button onClick={hideBanner}>X</button>
    </div>
  );
};

Banner.propTypes = {
  hideBanner: PropTypes.func,
};

Banner.defaultProps = {
  hideBanner: () => {},
};

export default Banner;
