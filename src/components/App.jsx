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
import LoadingSpinner from './LoadingSpinner';
import { generateSessionID } from '../lib/get-session-id';

import { PROJECT_STATUS } from '../ducks/project';
import { WORKFLOW_STATUS } from '../ducks/workflow';
import { SPLIT_STATUS } from '../ducks/splits';
import GALogAdapter from '../lib/ga-log-adapter';
import GoogleLogger from '../lib/GoogleLogger';
import GeordiLogAdapter from '../lib/geordi-log-adapter';
import { checkLoginUser } from '../ducks/login';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.googleLogger = null;

    if (!props.initialised) {
      props.dispatch(checkLoginUser());
    }
  }

  returnSomething(something) { // eslint-disable-line class-methods-use-this
    return something;
  }

  getChildContext() {
    return ({ googleLogger: this.googleLogger });
  }

  componentWillMount() {
    this.googleLogger = new GoogleLogger;
    this.googleLogger.subscribe(new GeordiLogAdapter(), new GALogAdapter(window.ga));
  }

  componentDidMount() {
    this.props.dispatch(fetchProject());
    this.googleLogger.remember({ projectToken: 'antiSlaveryManuscripts' });
    generateSessionID();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.googleLogger.remember({ userID: nextProps.user.id });
    }

    if (nextProps.splitStatus === SPLIT_STATUS.READY && this.props.variant !== nextProps.variant) {
      this.googleLogger.remember({ cohort: nextProps.variant, experiment: nextProps.splitID });
    }

    if (!nextProps.user && nextProps.user !== this.props.user) {
      this.googleLogger.forget(['userID']);
    }
  }

  render() {
    if (this.props.projectStatus !== PROJECT_STATUS.READY ||
        this.props.workflowStatus !== WORKFLOW_STATUS.READY) {
      return <LoadingSpinner />
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
  variant: PropTypes.string,
  splitID: PropTypes.string,
  projectStatus: PropTypes.string,
  workflowStatus: PropTypes.string,
  splitStatus: PropTypes.string,
};

App.defaultProps = {
  children: null,
  dialog: null,
  location: {},
  //--------
  user: null,
  dialog: null,
  variant: null,
  splitID: null,
  splitStatus: SPLIT_STATUS.IDLE,
  projectStatus: PROJECT_STATUS.IDLE,
  workflowStatus: WORKFLOW_STATUS.IDLE,
};

App.childContextTypes = {
  googleLogger: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    dialog: state.dialog.data,
    //--------
    splitID: state.splits.id,
    projectStatus: state.project.status,
    splitStatus: state.splits.status,
    workflowStatus: state.workflow.status,
    variant: state.splits.variant,
  };
};

export default connect(mapStateToProps)(App);
