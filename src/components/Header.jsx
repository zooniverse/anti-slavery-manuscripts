import React from 'react';
import { Link } from 'react-router';
import AuthContainer from '../containers/AuthContainer';

import AppLogo from '../images/zooniverse-icon-web-white-small.png';

export class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <Link to="/" className="app-title">
          <img role="presentation" src={AppLogo} />
          <h1>Liberating the Liberator</h1>
        </Link>
        <nav>
          <Link to="/" className="link">Home</Link>
          <Link to="/about" className="link">About</Link>
        </nav>
        <AuthContainer />
      </header>
    );
  }
}
