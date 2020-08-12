import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({ hideBanner }) => {
  return (
    <div className="top-banner">
      <h2>
        As of August 12, 2020, this project is complete. Our sincere thanks to the almost 14,000
        volunteers who helped to transcribe this collection of more than 12,000 letters
        in just over 2.5 years. We’ll post on the Talk boards and send out a newsletter
        with information about the project’s next steps, including where/when you’ll be
        able to access the completed transcriptions. Thanks again — we could not have
        done this without you.
      </h2>
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
