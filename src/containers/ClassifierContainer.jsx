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
        <section className="subject-viewer">
          <div className="subject-controls">Controls up here</div>
          <div className="subject-images">
            <div className="subject-image left">
            </div>
            <div className="subject-image right">
            </div>
          </div>
        </section>
        <section className="classifier-controls">
          <button href="#" className="white-grey button with-shadow">Tutorial</button>
          <div className="talk-section">Talk</div>
          <div className="crib-sheet">Cribsheet</div>
          <button href="#" className="white-green button with-shadow">Save &amp; Close</button>
          <button href="#" className="green button with-shadow">Done</button>
        </section>
      </main>
    );
  }
}

ClassifierContainer.propTypes = {};
ClassifierContainer.defaultProps = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(ClassifierContainer);  // Connects the Component to the Redux Store
