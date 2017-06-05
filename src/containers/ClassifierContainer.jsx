import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../ducks/login';

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="app-content classifier-page">
        Beep boop
      </main>
    );
  }
}

ClassifierContainer.propTypes = {};
ClassifierContainer.defaultProps = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(ClassifierContainer);  // Connects the Component to the Redux Store
