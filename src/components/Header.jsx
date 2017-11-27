import React from 'react';
import { ZooHeader } from 'zooniverse-react-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginToPanoptes, logoutFromPanoptes } from '../ducks/login';
import AuthContainer from '../containers/AuthContainer';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    return this.props.dispatch(loginToPanoptes());
  }

  logout() {
    this.props.dispatch(logoutFromPanoptes());
  }

  render() {
    const isAdmin = this.props.user && this.props.user.admin;

    return (
      <ZooHeader authContainer={<AuthContainer />} isAdmin={isAdmin} />
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    id: PropTypes.string,
  }),
};

Header.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
  };
};

export default connect(mapStateToProps)(Header);
