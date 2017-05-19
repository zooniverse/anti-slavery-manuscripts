import React from 'react';


export default class LoginButton extends React.Component {

  render() {
    const login = this.props.login;
    return (
      <button type="submit" onClick={login}>Login</button>
    );
  }

}

LoginButton.propTypes = {
  login: React.PropTypes.func.isRequired,
};
