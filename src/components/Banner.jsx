//BETA_ONLY
import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({ hideBanner }) => {
  return (
    <div className="beta-top-banner">
      <h2>
        Thank you for participating in our second round of beta review! Please
        sign in, and don’t forget to leave feedback using the link in the
        top right of the page.
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
