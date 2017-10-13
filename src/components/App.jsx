import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ZooFooter } from 'zooniverse-react-components';
import { fetchProject } from '../ducks/project';
import { fetchWorkflow } from '../ducks/workflow';
import { fetchSplit } from '../ducks/splits';
import Header from './Header';
import ProjectHeader from './ProjectHeader';
import Dialog from './Dialog';

class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    return something;
  }

  componentDidMount() {
    this.props.dispatch(fetchProject());
    this.props.dispatch(fetchWorkflow());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user != this.props.user) {
      this.props.dispatch(fetchSplit(nextProps.user));
    }
  }

  render() {
    const path = this.props.location.pathname;
    const showTitle = path === '/classify';

    return (
      <div>
        <Header />
        <ProjectHeader showTitle={showTitle} />
        {this.props.children}
        <div className="grommet">
          <ZooFooter />
        </div>

        {(this.props.dialog === null) ? null :
          <Dialog>
            {this.props.dialog}
          </Dialog>
        }

      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  dialog: PropTypes.node,
  dispatch: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

App.defaultProps = {
  children: null,
  dialog: null,
  location: {},
};

const mapStateToProps = (state) => {
  return {
    dialog: state.dialog.data,
    project: state.project,
    user: state.login.user
  };
};

export default connect(mapStateToProps)(App);
