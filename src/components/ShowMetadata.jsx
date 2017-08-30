import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';

const ShowMetadata = ({ metadata }) => {
  return (
    <div className="show-metadata">
      <h2>Subject Info</h2>
      <img role="presentation" className="divider" src={Divider} />
      <table width="100%">
        {Object.keys(metadata).map((key, i) => {
          if (metadata[key]) {
            return (
              <tr key={i}>
                <td><b>{key}</b></td>
                <td>{metadata[key]}</td>
              </tr>
            )
          }
        })}
      </table>
    </div>
  );
};

ShowMetadata.propTypes = {
  metadata: PropTypes.object
};

export default ShowMetadata;
