// A smart component that handles state for the LoginButton and LoggedInUser
// components. Stores state in Redux.

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Anchor from 'grommet/components/Anchor';
import { LoginButton, LogoutButton, UserMenu, UserNavigation } from 'zooniverse-react-components';
import { clearSplits } from '../ducks/splits';
import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../ducks/login';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    if (!props.initialised) {
      props.dispatch(checkLoginUser());
    }
  }

  login() {
    return this.props.dispatch(loginToPanoptes());
  }

  logout() {
    if (this.props.splits) {
      this.props.dispatch(clearSplits());
    }
    this.props.dispatch(logoutFromPanoptes());
  }

  render() {
    let menuItems;

    if (this.props.user && this.props.initialised) {
      const login = this.props.user.login;
      menuItems = [
        <Anchor href={`https://www.zooniverse.org/users/${login}`}>Profile</Anchor>,
        <Anchor href="https://www.zooniverse.org/settings">Settings</Anchor>,
        <Anchor href={`https://www.zooniverse.org/collections/${login}`}>Collections</Anchor>,
        <Anchor href={`https://www.zooniverse.org/favorites/${login}`}>Favorites</Anchor>,
        <LogoutButton logout={this.logout} />
      ];
    }

    return (this.props.user)
      ? <div>
          <UserNavigation />
          <UserMenu user={this.props.user} userMenuNavList={menuItems} />
        </div>
      : <div>
          <LoginButton toggleModal={this.login} />
        </div>
  }
}

AuthContainer.propTypes = {
  user: PropTypes.shape({ login: PropTypes.string }),
  initialised: PropTypes.bool,
  dispatch: PropTypes.func,
  splits: PropTypes.object
};

AuthContainer.defaultProps = {
  user: null,
  initialised: false,
  splits: null
};

const mapStateToProps = (state) => ({
  user: state.login.user,
  initialised: state.login.initialised,
  splits: state.splits.data
});

export default connect(mapStateToProps)(AuthContainer);  // Connects the Component to the Redux Store
