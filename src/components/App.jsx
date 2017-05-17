import React from 'react';
import { Link } from 'react-router';
import packageJSON from '../../package.json';

import HeaderAuth from './HeaderAuth';

export default class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    // this is only for testing purposes. Check /test/components/App-test.js
    return something;
  }
  render() {
    return (
      <div>
        <header className="app-header">
          <Link to="/about" className="link">About</Link>
          <Link to="/poweredby" className="link">Powered by</Link>
          <HeaderAuth />
        </header>
        <section className="content-section">
          {this.props.children || 'Welcome to Liberating the Liberator'}
        </section>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.node,
};
