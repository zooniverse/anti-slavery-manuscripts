import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Split } from 'seven-ten';
import { Tutorial } from 'zooniverse-react-components';
import { config } from '../config';

import {
  setRotation, setContrast, resetView,
  togglePreviousMarks, setViewerState,
  MARKS_STATE, SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import { fetchGuide, GUIDE_STATUS } from '../ducks/field-guide';
import { fetchTutorial, TUTORIAL_STATUS } from '../ducks/tutorial';
import { toggleFavorite } from '../ducks/subject';
import { toggleDialog } from '../ducks/dialog';
import { VARIANT_TYPES, toggleOverride } from '../ducks/splits';
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
import FieldGuide from '../components/FieldGuide';
import SubmitClassificationForm from '../components/SubmitClassificationForm';

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
    this.showTutorial = this.showTutorial.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.prepareSubmitClassificationForm = this.prepareSubmitClassificationForm.bind(this);
    this.toggleAdminOverride = this.toggleAdminOverride.bind(this);
    this.toggleFieldGuide = this.toggleFieldGuide.bind(this);

    this.state = {
      popup: null,
    }
  }

  //----------------------------------------------------------------

  componentWillReceiveProps(nextProps) {
    if (nextProps.workflow && nextProps.preferences && nextProps.tutorialStatus === TUTORIAL_STATUS.IDLE) {
      this.props.dispatch(fetchTutorial(nextProps.workflow));

      if (this.context.googleLogger) {
        this.context.googleLogger.remember({ workflowID: nextProps.workflow.id });
      }
    }

    if (nextProps.tutorial !== this.props.tutorial) {
      Tutorial.startIfNecessary(Tutorial, nextProps.tutorial, nextProps.user, nextProps.preferences);
    }

    if (nextProps.currentSubject !== this.props.currentSubject && this.context.googleLogger) {
      this.context.googleLogger.remember({ subjectID: nextProps.currentSubject.id });
    }
  }

  componentWillUnmount() {
    Split.clear();
    this.context.googleLogger && this.context.googleLogger.forget(['subjectID']);
  }

  componentDidMount() {
    this.props.dispatch(fetchGuide());
  }

  render() {
    const isAdmin = this.props.user && this.props.user.admin;
    const shownMarksClass = (MARKS_STATE.ALL === this.props.shownMarks) ? "fa fa-eye" :
      (MARKS_STATE.USER === this.props.shownMarks) ? "fa fa-eye-slash" : "fa fa-eye-slash grey";

    return (
      <main className="app-content classifier-page flex-row">
        <div className="project-background"></div>
        <section className="help-pane">
          <div>
            <h2>directions</h2>
            <p>
              Using the Annotate tool, click under each word in a line of text,
              then add your transcription.

              {/*TEMPORARILY REMOVED: CRIBSHEET Clip common symbols or phrases to your
              crib sheet for reference.*/}
            </p>
            <p>
              When you&apos;re finished, discuss the document on Talk, or move
              on to the next subject right away.
            </p>
          </div>
          <div className="help-buttons">
            {this.props.tutorial && this.props.tutorialStatus === TUTORIAL_STATUS.READY && (
              <button href="#" className="white-red button" onClick={this.showTutorial}>Tutorial</button>
            )}
            {this.props.guide && this.props.guideStatus === GUIDE_STATUS.READY && (
              <button href="#" className="white-red button" onClick={this.toggleFieldGuide}>Field Guide</button>
            )}
            {/*TEMPORARILY REMOVED: CRIBSHEET
            <button href="#" className="white-red button">Your Crib Sheet</button>*/}
            <img className="divider" role="presentation" src={Divider} />


            <button href="#" className="white-green button" onClick={this.prepareSubmitClassificationForm}>Finish</button>
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
                <i className={shownMarksClass} />
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

            {(!(isAdmin && this.props.previousAnnotations && this.props.previousAnnotations.length > 0)) ? null : (
              <label
                className="admin-override"
                title="Enter collaborative mode if not available"
              >
                <input
                  onChange={this.toggleAdminOverride}
                  type="checkbox"
                  value={this.props.adminOverride}
                />
                <span>Show Previous Annotations</span>
              </label>
            )}

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
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'novel-transcription' });
    }

    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
  }

  prepareSubmitClassificationForm() {
    this.setState({ popup: <SubmitClassificationForm closePopup={this.closePopup} /> });
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

  toggleAdminOverride() {
    this.props.dispatch(toggleOverride());
  }

  showMetadata() {
    this.props.dispatch(toggleDialog(
      <ShowMetadata metadata={this.props.currentSubject.metadata} />));
  }

  toggleFieldGuide() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'open-field-guide' });
    }

    this.props.dispatch(toggleDialog(
      <FieldGuide guide={this.props.guide} icons={this.props.icons} />, false));
  }

  showTutorial() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'open-tutorial' });
    }

    if (this.props.tutorial) {
      Tutorial.start(Tutorial, this.props.tutorial, this.props.user, this.props.preferences);
    }
  }

  showCollections() {
    this.setState({ popup: <CollectionsContainer closePopup={this.closePopup} /> });
  }
}

ClassifierContainer.propTypes = {
  adminOverride: PropTypes.bool,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
  }),
  dispatch: PropTypes.func,
  guide: PropTypes.object,
  guideStatus: PropTypes.string,
  rotation: PropTypes.number,
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  project: PropTypes.shape({
    id: PropTypes.string,
  }),
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  shownMarks: PropTypes.number,
  tutorial: PropTypes.shape({
    steps: PropTypes.array
  }),
  tutorialStatus: PropTypes.string,
  variant: PropTypes.string,
  viewerState: PropTypes.string,
  workflow: PropTypes.shape({
    id: PropTypes.string,
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};
ClassifierContainer.defaultProps = {
  adminOverride: false,
  previousAnnotations: [],
  guide: null,
  guideStatus: GUIDE_STATUS.IDLE,
  icons: null,
  project: null,
  rotation: 0,
  scaling: 1,
  shownMarks: 0,
  tutorial: null,
  tutorialStatus: TUTORIAL_STATUS.IDLE,
  workflow: null,
  variant: VARIANT_TYPES.INDIVIDUAL,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
};

ClassifierContainer.contextTypes = {
  googleLogger: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    adminOverride: state.splits.adminOverride,
    classification: state.classifications.classification,
    currentSubject: state.subject.currentSubject,
    previousAnnotations: state.previousAnnotations.marks,
    favoriteSubject: state.subject.favorite,
    guide: state.fieldGuide.guide,
    guideStatus: state.fieldGuide.status,
    icons: state.fieldGuide.icons,
    preferences: state.project.userPreferences,
    project: state.project.data,
    rotation: state.subjectViewer.rotation,
    scaling: state.subjectViewer.scaling,
    shownMarks: state.subjectViewer.shownMarks,
    splits: state.splits.splits,
    tutorial: state.tutorial.data,
    tutorialStatus: state.tutorial.status,
    user: state.login.user,
    variant: state.splits.variant,
    viewerState: state.subjectViewer.viewerState,
    workflow: state.workflow.data,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
