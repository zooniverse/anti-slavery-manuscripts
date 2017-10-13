import React from 'react';
import { Link } from 'react-router';
import { ZooHeader, LoginButton, LogoutButton, UserMenu } from 'zooniverse-react-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../ducks/login';
import AuthContainer from '../containers/AuthContainer';
import SiteNavItems from '../lib/site-nav-items';

class Header extends React.Component {
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
    this.props.dispatch(logoutFromPanoptes());
  }

  render() {
    return (
      <ZooHeader authContainer={<AuthContainer />} />
    );
  }
}

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

Header.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user
  };
};

export default connect(mapStateToProps)(Header);
