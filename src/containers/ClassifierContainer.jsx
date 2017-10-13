import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Split } from 'seven-ten';

import {
  setRotation, setContrast, resetView,
  togglePreviousMarks, setViewerState,
  SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import { toggleFavorite } from '../ducks/subject';
import { toggleDialog } from '../ducks/dialog';
import {
  createClassification, submitClassification
} from '../ducks/classifications';

import SubjectViewer from './SubjectViewer';

import Navigator from './Navigator';
import FilmstripViewer from '../components/FilmstripViewer';
import FavoritesButton from '../components/FavoritesButton';
import Popup from '../components/Popup';
import ShowMetadata from '../components/ShowMetadata';
import ZoomTools from '../components/ZoomTools';
import CollectionsContainer from './CollectionsContainer';
import Divider from '../images/img_divider.png';

const ROTATION_STEP = 90;

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);

    //Bind events
    this.useAnnotationTool = this.useAnnotationTool.bind(this);
    this.useRotate90 = this.useRotate90.bind(this);
    this.useResetImage = this.useResetImage.bind(this);
    this.togglePreviousMarks = this.togglePreviousMarks.bind(this);
    this.useContrast = this.useContrast.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.showMetadata = this.showMetadata.bind(this);
    this.showCollections = this.showCollections.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.completeClassification = this.completeClassification.bind(this);

    this.state = {
      popup: null,
    }
  }

  //----------------------------------------------------------------

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentSubject && nextProps.workflow && !this.props.classification) {
      this.props.dispatch(createClassification());
    }
  }

  componentWillUnmount() {
    Split.clear();
  }

  render() {
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
            <button href="#" className="white-green button" onClick={this.completeClassification}>Done</button>
            <button href="#" className="green button" onClick={this.completeClassification}>Done &amp; Talk</button>
          </div>
        </section>

        <FilmstripViewer />

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

            <button className="flat-button block" onClick={this.togglePreviousMarks}>
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

            {this.props.user && (
              <button className="flat-button block" onClick={this.showCollections}>
                <span className="classifier-toolbar__icon">
                  <i className="fa fa-list" />
                </span>
                <span>Collection</span>
              </button>
            )}

            <button className="flat-button block" onClick={this.showMetadata}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-info-circle" />
              </span>
              <span>Subject Info</span>
            </button>
          </div>
        </section>

        {(this.state.popup === null) ? null :
          <Popup onClose={this.closePopup.bind(this)}>
            {this.state.popup}
          </Popup>
        }

      </main>
    );
  }

  //----------------------------------------------------------------

  closePopup() {
    this.setState({ popup: null });
  }

  //----------------------------------------------------------------

  useAnnotationTool() {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
  }

  completeClassification() {
    this.props.dispatch(submitClassification())
  }

  useRotate90() {
    this.props.dispatch(setRotation(this.props.rotation + ROTATION_STEP));
  }

  useResetImage() {
    this.props.dispatch(resetView());
  }

  togglePreviousMarks() {
    this.props.dispatch(togglePreviousMarks());
  }

  useContrast() {
    this.props.dispatch(setContrast());
  }

  toggleFavorite() {
    this.props.dispatch(toggleFavorite());
  }

  showMetadata() {
    this.props.dispatch(toggleDialog(
      <ShowMetadata metadata={this.props.currentSubject.metadata} />));
  }

  showCollections() {
    this.setState({ popup: <CollectionsContainer closePopup={this.closePopup} /> })
  }
}

ClassifierContainer.propTypes = {
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
  }),
  dispatch: PropTypes.func,
  rotation: PropTypes.number,
  project: PropTypes.shape({
    id: PropTypes.string,
  }),
  scaling: PropTypes.number,
  viewerState: PropTypes.string,
  workflow: PropTypes.shape({
    id: PropTypes.string,
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};
ClassifierContainer.defaultProps = {
  project: null,
  rotation: 0,
  scaling: 1,
  workflow: null,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
};
const mapStateToProps = (state, ownProps) => {
  return {
    classification: state.classifications.classification,
    user: state.login.user,
    splits: state.splits.splits,
    favoriteSubject: state.subject.favorite,
    currentSubject: state.subject.currentSubject,
    project: state.project.data,
    rotation: state.subjectViewer.rotation,
    scaling: state.subjectViewer.scaling,
    workflow: state.workflow.data,
    viewerState: state.subjectViewer.viewerState,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
