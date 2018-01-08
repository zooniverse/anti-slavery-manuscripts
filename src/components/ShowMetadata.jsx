import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';

const ShowMetadata = ({ metadata }) => {
  return (
    <div className="handle show-metadata">
      <img role="presentation" className="divider" src={Divider} />
      <table width="100%">
        {Object.keys(metadata).map((key, i) => {
          const isHidden = /^\s*#|(\/\/)|!/g.test(key);
          if (metadata[key] && !isHidden) {
            const isUrl = metadata[key].substring(0, 4) === 'http';
            let info = metadata[key];
            if (isUrl) {
              info = <a target="_blank" rel="noopener noreferrer" href={metadata[key]}>{metadata[key]}</a>;
            }
            return (
              <tr key={i}>
                <td><b>{key}</b></td>
                <td>{info}</td>
              </tr>
            );
          }
        })}
      </table>
    </div>
  );
};

ShowMetadata.propTypes = {
  metadata: PropTypes.object,
};

export default ShowMetadata;
