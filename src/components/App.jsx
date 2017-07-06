import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ProjectHeader from './ProjectHeader';

class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    return something;
  }

  render() {
    return (
      <div>
        <Header />
        <ProjectHeader />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
