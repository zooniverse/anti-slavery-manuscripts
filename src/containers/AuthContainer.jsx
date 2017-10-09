// A smart component that handles state for the LoginButton and LoggedInUser
// components. Stores state in Redux.

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Anchor from 'grommet/components/Anchor';
import { LoginButton, LogoutButton, UserMenu, UserNavigation, OauthModal } from 'zooniverse-react-components';
import { checkLoginUser, loginToPanoptes, logoutFromPanoptes, toggleLoginModal } from '../ducks/login';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleOauthModal = this.toggleOauthModal.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    if (!props.initialised) {
      props.dispatch(checkLoginUser());
    }
  }

  login() {
    return this.props.dispatch(loginToPanoptes());
  }

  logout() {
    this.props.dispatch(logoutFromPanoptes());
  }

  toggleOauthModal() {
    this.props.dispatch(toggleLoginModal(!this.props.showModal));
  }

  loginWithGoogle() {
    let googleUrl = 'https://panoptes.zooniverse.org/users/auth/google_oauth2';

    // if (env === 'development') {
    //   googleUrl = 'https://panoptes-staging.zooniverse.org/users/auth/google_oauth2';
    // }
    //
    // Promise.resolve(storeLocation(location.pathname, location.search))
    //   .then(() => {window.location.href = googleUrl; })
    //   .catch((error) => { redirectErrorHandler; });
    return null;
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
          <LoginButton toggleModal={this.toggleOauthModal} />
          <OauthModal
            login={this.login}
            loginWIthGoogle={this.loginWIthGoogle}
            onClose={this.toggleOauthModal}
            showOauthModal={this.props.showModal} />
        </div>
  }
}

AuthContainer.propTypes = {
  user: PropTypes.shape({ login: PropTypes.string }),
  initialised: PropTypes.bool,
  dispatch: PropTypes.func,
  showModal: PropTypes.bool
};

AuthContainer.defaultProps = {
  user: null,
  initialised: false,
  showModal: false
};

const mapStateToProps = (state) => ({
  user: state.login.user,
  initialised: state.login.initialised,
  showModal: state.login.showModal
});

export default connect(mapStateToProps)(AuthContainer);  // Connects the Component to the Redux Store
