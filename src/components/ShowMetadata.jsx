import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';

const ShowMetadata = ({ metadata }) => {
  return (
    <div className="show-metadata">
      <img role="presentation" className="divider" src={Divider} />
      <table width="100%">
        {Object.keys(metadata).map((key, i) => {
          const isHidden = /^\s*#|(\/\/)|!/g.test(key);
          if (metadata[key] && !isHidden) {
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
