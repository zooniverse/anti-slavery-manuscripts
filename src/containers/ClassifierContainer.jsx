import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  setRotation, setScaling, setContrast,
  resetView, setViewerState, SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import { toggleFavorite } from '../ducks/subject';

import SubjectViewer from './SubjectViewer';

import Navigator from './Navigator';
import FavoritesButton from '../components/FavoritesButton'
import Popup from '../components/Popup';
import Divider from '../images/img_divider.png';

const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);

    //Bind events
    this.useAnnotationTool = this.useAnnotationTool.bind(this);
    this.usePanTool = this.usePanTool.bind(this);
    this.useZoomIn = this.useZoomIn.bind(this);
    this.useZoomOut = this.useZoomOut.bind(this);
    this.useRotate90 = this.useRotate90.bind(this);
    this.useResetImage = this.useResetImage.bind(this);
    this.useContrast = this.useContrast.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);

    //TEMPORARY
    this.state = {
      TEST_POPUP: null,
    }
  }

  //----------------------------------------------------------------

  render() {
    console.log(this.props.user);
    return (
      <main className="app-content classifier-page flex-row">
        <div className="project-background"></div>
        <section className="help-pane">
          <div>
            <h2>directions</h2>
            <p>
              Using the Annotate tool, click under each word in a line of text,
              then add your transcription. Clip common symbols or phrases to your
              crib sheet for reference.
            </p>
            <p>
              When you&apos;re finished, discuss the document on Talk, or move
              on to the next subject right away.
            </p>
          </div>
          <div className="help-buttons">
            <button href="#" className="white-red button">Field Guide</button>
            <button href="#" className="white-red button">Your Crib Sheet</button>
            <img className="divider" role="presentation" src={Divider} />
            <button href="#" className="white-green button">Done</button>
            <button href="#" className="green button">Done &amp; Talk</button>
          </div>
        </section>
        <SubjectViewer currentSubject={this.props.currentSubject} />
        <section className="classifier-controls">
          <div>
            <h2>Navigator</h2>
            <Navigator />
          </div>
          <img className="divider" role="presentation" src={Divider} />
          <div className="classifier-toolbar">
            <h2>Toolbar</h2>

            <button
              className={(this.props.viewerState === SUBJECTVIEWER_STATE.ANNOTATING) ? 'flat-button block selected' : 'flat-button block'}
              onClick={this.useAnnotationTool}
            >
              <span className="classifier-toolbar__icon">
                <i className="fa fa-plus-circle" />
              </span>
              <span>Annotate</span>
            </button>

            <button
              className={(this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) ? 'flat-button block selected' : 'flat-button block'}
              onClick={this.usePanTool}
            >
              <span className="classifier-toolbar__icon">
                <i className="fa fa-arrows" />
              </span>
              <span>Pan image</span>
            </button>

            <button className="flat-button block" onClick={this.useZoomIn}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-plus" />
              </span>
              <span>Zoom In</span>
            </button>

            <button className="flat-button block" onClick={this.useZoomOut}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-minus" />
              </span>
              <span>Zoom Out</span>
            </button>

            <button className="flat-button block" onClick={this.useRotate90}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-repeat" />
              </span>
              <span>Rotate 90 &deg;</span>
            </button>

            <button className="flat-button block" onClick={this.useResetImage}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-refresh" />
              </span>
              <span>Reset Image</span>
            </button>

            <button className="flat-button block">
              <span className="classifier-toolbar__icon">
                <i className="fa fa-eye" />
              </span>
              <span>Toggle Prev. Marks</span>
            </button>

            <button className="flat-button block" onClick={this.useContrast}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-adjust" />
              </span>
              <span>Contrast</span>
            </button>

            {this.props.user && (
              <FavoritesButton favorite={this.props.favoriteSubject} toggleFavorite={this.toggleFavorite} />
            )}

            <button className="flat-button block">
              <span className="classifier-toolbar__icon">
                <i className="fa fa-list" />
              </span>
              <span>Collection</span>
            </button>

            <button className="flat-button block">
              <span className="classifier-toolbar__icon">
                <i className="fa fa-info-circle" />
              </span>
              <span>Subject Info</span>
            </button>

          </div>
        </section>

        {(this.state.TEST_POPUP === null) ? null :
          <Popup onClose={this.TEST_CLOSE_POPUP.bind(this)}>
            {this.state.TEST_POPUP}
          </Popup>
        }
      </main>
    );
  }

  //----------------------------------------------------------------

  TEST_OPEN_POPUP() {
    this.setState({ TEST_POPUP: (
      <div>
        <h1>Hello World!</h1>
        <h2>Sample popup</h2>
        <p>This is an example of how we can add popup messages (and similar things) to our project.</p>
        <p>This will be useful for error messages and info boxes.</p>
      </div>
    ) });
  }

  TEST_CLOSE_POPUP() {
    this.setState({ TEST_POPUP: null });
  }

  //----------------------------------------------------------------

  useAnnotationTool() {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
  }

  usePanTool() {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.NAVIGATING));
  }

  useZoomIn() {
    this.props.dispatch(setScaling(this.props.scaling + ZOOM_STEP));
  }

  useZoomOut() {
    this.props.dispatch(setScaling(this.props.scaling - ZOOM_STEP));
  }

  useRotate90() {
    this.props.dispatch(setRotation(this.props.rotation + ROTATION_STEP));
  }

  useResetImage() {
    this.props.dispatch(resetView());
  }

  useContrast() {
    this.props.dispatch(setContrast());
  }

  toggleFavorite() {
    this.props.dispatch(toggleFavorite());
  }
}

ClassifierContainer.propTypes = {
  dispatch: PropTypes.func,
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  viewerState: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string
  })
};
ClassifierContainer.defaultProps = {
  rotation: 0,
  scaling: 1,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
};
const mapStateToProps = (state, ownProps) => {
  const store = state.subjectViewer;
  return {
    user: state.login.user,
    favoriteSubject: state.subject.favorite,
    rotation: store.rotation,
    scaling: store.scaling,
    viewerState: store.viewerState,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
