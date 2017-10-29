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

import { PROJECT_STATUS } from '../ducks/project';
import { WORKFLOW_STATUS } from '../ducks/workflow';

class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    return something;
  }

  componentDidMount() {
    this.props.dispatch(fetchProject());
    this.props.dispatch(fetchWorkflow());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.props.dispatch(fetchSplit(nextProps.user));
    }
  }

  render() {
    if (this.props.projectStatus !== PROJECT_STATUS.READY ||
        this.props.workflowStatus !== WORKFLOW_STATUS.READY) {
      return <div>Loading...</div>;
    }  //TODO: Consider what to do for STATUS: ERROR
    
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
  dispatch: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  //--------
  user: PropTypes.object,
  dialog: PropTypes.node,
  projectStatus: PropTypes.string,
  workflowStatus: PropTypes.string,
};

App.defaultProps = {
  children: null,
  dialog: null,
  location: {},
  //--------
  user: null,
  dialog: null,
  projectStatus: PROJECT_STATUS.IDLE,
  workflowStatus: WORKFLOW_STATUS.IDLE,
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    dialog: state.dialog.data,
    //--------
    projectStatus: state.project.status,
    workflowStatus: state.workflow.status,
  };
};

export default connect(mapStateToProps)(App);
