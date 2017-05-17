import React from 'react';
import { Link } from 'react-router';
import HeaderAuth from './HeaderAuth';

export class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <Link to="/about" className="link">About</Link>
        <Link to="/poweredby" className="link">Powered by</Link>
        <HeaderAuth />
      </header>
    );
  }
}
