import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProject } from '../ducks/project';
import Header from './Header';
import ProjectHeader from './ProjectHeader';

class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    return something;
  }

  componentDidMount() {
    this.props.dispatch(fetchProject());
  }

  render() {
    return (
      <div>
        <Header />
        <ProjectHeader onIndex={this.props.location.pathname === '/'} />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};


const mapStateToProps = (state) => {
  return {
    project: state.project,
  };
};

export default connect(mapStateToProps)(App);
