import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({ hideBanner }) => {
  //If no messages, just return null.
  return null;
  
  /*
  return (
    <div className="top-banner">
      <h2>
        Thanks for participating in our beta review! We're making some changes
        based on your feedback, and will be launching the full project soon!
      </h2>
      <button onClick={hideBanner}>X</button>
    </div>
  );
  */
};

Banner.propTypes = {
  hideBanner: PropTypes.func,
};

Banner.defaultProps = {
  hideBanner: () => {},
};

export default Banner;
