// A smart component that handles state for the LoginButton and LoggedInUser
// components. Stores state in Redux.

import React from 'react';
import { connect } from 'react-redux';
import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../actions/login';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const PropTypes = React.PropTypes;

class HeaderAuth extends React.Component {

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (!this.props.initialised) {
      this.props.dispatch(checkLoginUser());
    }
  }

  login() {
    return this.props.dispatch(loginToPanoptes());
  }

  logout() {
    this.props.dispatch(logoutFromPanoptes());
  }

  render() {
    return (this.props.user)
      ? <LogoutButton user={this.props.user} logout={this.logout} />
      : <LoginButton login={this.login} />;
  }
}

HeaderAuth.propTypes = {
  user: PropTypes.shape({ login: PropTypes.string }),
  initialised: PropTypes.bool,
  dispatch: PropTypes.func,
};

HeaderAuth.defaultProps = {
  user: null,
  initialised: false,
};

function mapStateToProps(state) {  // Listens for changes in the Redux Store
  return {
    user: state.login.user,
    initialised: state.login.initialised,
  };
}
export default connect(mapStateToProps)(HeaderAuth);  // Connects the Component to the Redux Store
