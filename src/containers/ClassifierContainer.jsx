import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../ducks/login';

import TmpSvgIcon from '../components/TmpSvgIcon';
import TmpImg from '../images/zooniverse-icon-web-white-small.png';

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="app-content classifier-page">
        <section className="subject-viewer">
          <div className="subject-controls">
            <span>
              <button className="icon button"><TmpSvgIcon /></button>
              <span>Add Transcription</span>
            </span>
            <span>
              <button className="icon button"><TmpSvgIcon /></button>
              <span>Rotate Image</span>
            </span>
            <span>
              <button className="icon button"><TmpSvgIcon /></button>
              <button className="icon button"><TmpSvgIcon /></button>
              <span>Zoom In/Out</span>
            </span>
            <span className="filler">
              <button className="icon button"><TmpSvgIcon /></button>
              <button className="icon button"><TmpSvgIcon /></button>
            </span>
            <button className="dusty-lavender button">Field Guide</button>
          </div>
          <div className="subject-images">
            <div className="subject-image left"></div>
            <div className="subject-image right"></div>
          </div>
        </section>
        <section className="classifier-controls">
          <button href="#" className="white-grey button with-shadow">Tutorial</button>
          <div className="talk-section mini-control">
            <div className="title">
              <b>Talk</b>
              <button className="icon button"><TmpSvgIcon width="15" height="15" /></button>
            </div>
            <div className="list">
              <div className="item">
                <span className="username">@username</span>
                <p>Letters from Deborah Weston to Anne Warren Weston</p>
              </div>
              <div className="item">
                <span className="username">@freshprince</span>
                <p>Now this is a story all about how my life got flipped-turned upside down</p>
              </div>
              <button className="icon button"><TmpSvgIcon width="15" height="15" /></button>
            </div>
            <button className="dusty-lavender button">View on Talk</button>
          </div>
          <div className="crib-sheet mini-control">
            <div className="title">
              <b>Crib Sheet</b>
              <i>Save interesting images for reference</i>
              <button className="icon button"><TmpSvgIcon width="15" height="15" /></button>
            </div>
            <div className="list">
              <div className="item">
                <span className="thumbnail"><img src={TmpImg} /></span>
                <p>Ampersand</p>
              </div>
              <div className="item">
                <span className="thumbnail"><img src={TmpImg} /></span>
                <p>Zooniverse Logo</p>
              </div>
              <button className="icon button"><TmpSvgIcon width="15" height="15" /></button>
            </div>
          </div>
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
