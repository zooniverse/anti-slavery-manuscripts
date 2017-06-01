import React from 'react';
import PropTypes from 'prop-types';

const LoginButton = ({ login }) => {
  return (
    <div className="login-button">
      <button type="submit" onClick={login}>Login</button>
    </div>
    
  );
};

LoginButton.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginButton;
