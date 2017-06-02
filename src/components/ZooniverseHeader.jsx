import React from 'react';
import { Link } from 'react-router';
import { ZooniverseLogo } from 'zooniverse-react-components/lib';

class ZooniverseHeader extends React.Component {
  render() {
    return (
      <div className="zooniverse-header">
        <a className="zooniverse-main-logo" href="https://www.zooniverse.org"><ZooniverseLogo /></a>
        <div className="zooniverse-links">
          <a className="link" href="#" target="_blank">Projects</a>
          <a className="link" href="#" target="_blank">About</a>
          <a className="link" href="#" target="_blank">Get Involved</a>
          <a className="link" href="#" target="_blank">Talk</a>
          <a className="link" href="#" target="_blank">Build A Project</a>
          <a className="link" href="#" target="_blank">News</a>
        </div>
        <div className="zooniverse-account">
          <a className="link" href="#" target="_blank">???</a>
          <a className="link" href="#" target="_blank">???</a>
          <a className="link" href="#" target="_blank">???</a>
        </div>
      </div>
    );
  }
}

export default ZooniverseHeader;