import React from 'react';
import PropTypes from 'prop-types';

const LogoutButton = ({ logout, user }) => {
  return (
    <div className="logout-button">
      <span>{user.login}</span>
      <button type="submit" onClick={logout}>Logout</button>
    </div>
  );
};

LogoutButton.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    login: PropTypes.string
  }).isRequired,
};

export default LogoutButton;
