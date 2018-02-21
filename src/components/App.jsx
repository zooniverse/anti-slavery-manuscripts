import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ZooFooter } from 'zooniverse-react-components';
import { fetchProject, PROJECT_STATUS } from '../ducks/project';
import { disableBanner } from '../ducks/banner';
import { toggleDialog } from '../ducks/dialog';

import Header from './Header';
import ProjectHeader from './ProjectHeader';
import Dialog from './Dialog';
import LoadingSpinner from './LoadingSpinner';
import { generateSessionID } from '../lib/get-session-id';

import apiClient from 'panoptes-client/lib/api-client';
import oauth from 'panoptes-client/lib/oauth';

import { env } from '../config';
import { WORKFLOW_STATUS } from '../ducks/workflow';
import { SPLIT_STATUS } from '../ducks/splits';
import GALogAdapter from '../lib/ga-log-adapter';
import GoogleLogger from '../lib/GoogleLogger';
import { checkLoginUser } from '../ducks/login';
import Banner from './Banner';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.googleLogger = null;
    this.hideBanner = this.hideBanner.bind(this);

    if (!props.initialised) {  //NOTE: This should almost always trigger, since App.constructor() triggers exactly once, on the website loading, when all initial values are at their default.
      props.dispatch(checkLoginUser());
    }
    
    //SPECIAL: users on ASM tend to stay in a single session for WAY longer
    //than a standard Zooniverse CFE user, so we're encountering issues where
    //their login tokens timeout in the middle of classifying a document.
    //The following is a mechanism that checks if a user is logged in before
    //performing any action that may require a valid login token, taking safety
    //actions if necessary.
    apiClient.beforeEveryRequest = this.checkIfLoggedInUserIsStillLoggedIn.bind(this);
  }
  
  checkIfLoggedInUserIsStillLoggedIn() {
    const props = this.props;
    
    return oauth.checkBearerToken()
      .then((token) => {
        console.log(`checkBearerToken - initialised: ${!!props.initialised}, user: ${!!props.user}, token: ${!!token}`);
      
        this.props.dispatch(toggleDialog(<div>Oh no</div>, false, true));
      
        //If the App thinks you're logged in, but the token says otherwise, deploy emergency measures.
        if (props.initialised && props.user && !token) {
          //TODO
        }
      })
      .catch((err) => {
        console.error('App.checkIfLoggedInUserIsStillLoggedIn() error: ', err);
      });
  }

  getChildContext() {
    return ({ googleLogger: this.googleLogger });
  }

  componentWillMount() {
    this.googleLogger = new GoogleLogger();
    this.googleLogger.subscribe(new GALogAdapter(window.ga));
  }

  componentDidMount() {
    this.props.dispatch(fetchProject());
    this.googleLogger.remember({ projectToken: 'antiSlaveryManuscripts' });
    Rollbar.global({ maxItems: 10 });
    Rollbar.configure({ payload: { environment: env } });
    generateSessionID();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.googleLogger.remember({ userID: nextProps.user.id });
    }

    if (nextProps.splitStatus !== this.props.splitStatus && nextProps.splitStatus === SPLIT_STATUS.READY) {
      this.googleLogger.remember({ cohort: nextProps.variant, experiment: nextProps.splitID });
    }

    if (!nextProps.user && nextProps.user !== this.props.user) {
      this.googleLogger.forget(['userID']);
    }
  }

  hideBanner() {
    this.props.dispatch(disableBanner());
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

        {(this.props.showBanner)
          ? <Banner hideBanner={this.hideBanner} /> : null
        }

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
  initialised: PropTypes.bool,
  //--------
  dialog: PropTypes.node,
  //--------
  variant: PropTypes.string,
  splitID: PropTypes.string,
  projectStatus: PropTypes.string,
  workflowStatus: PropTypes.string,
  showBanner: PropTypes.bool,
  splitStatus: PropTypes.string,
};

App.defaultProps = {
  children: null,
  location: {},
  //--------
  user: null,
  initialised: false,
  //--------
  dialog: null,
  //--------
  variant: null,
  splitID: null,
  projectStatus: PROJECT_STATUS.IDLE,
  workflowStatus: WORKFLOW_STATUS.IDLE,
  showBanner: true,
  splitStatus: SPLIT_STATUS.IDLE,
};

App.childContextTypes = {
  googleLogger: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    showBanner: state.banner.show,
    user: state.login.user,
    initialised: state.login.initialised,
    //--------
    dialog: state.dialog.data,
    //--------
    variant: state.splits.variant,
    splitID: state.splits.id,
    projectStatus: state.project.status,
    workflowStatus: state.workflow.status,
    splitStatus: state.splits.status,
  };
};

export default connect(mapStateToProps)(App);
