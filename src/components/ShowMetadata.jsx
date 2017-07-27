import React from 'react';
import PropTypes from 'prop-types';

const ShowMetadata = ({ metadata }) => {
  return (
    <div className="show-metadata">
      <h2>Subject Metadata</h2>
      <table>
        {Object.keys(metadata).map((key, i) => {
          if (metadata[key]) {
            return (
              <tr>
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
