import React from 'react';


export default class LoginButton extends React.Component {

  render() {
    const login = this.props.login;
    return (
      <div className="logout-button">
        <span>example_user</span>
        <button type="submit" onClick={login}>Login</button>
      </div>
    );
  }

}

LoginButton.propTypes = {
  login: React.PropTypes.func.isRequired,
};
