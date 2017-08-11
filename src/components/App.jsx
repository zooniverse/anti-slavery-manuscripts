import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ZooFooter } from 'zooniverse-react-components';
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
    const path = this.props.location.pathname;
    const showTitle = path === '/' || path === '/about-the-collection';

    return (
      <div>
        <Header />
        <ProjectHeader showTitle={showTitle} />
        {this.props.children}
        <div className="grommet">
          <ZooFooter />
        </div>
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
