import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({ hideBanner }) => {
  // If no messages, just return null.
  // return null;

  return (
    <div className="top-banner">
      <h2>
        This project is undergoing some light maintenance and will resume shortly, with new letters to transcribe!
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
