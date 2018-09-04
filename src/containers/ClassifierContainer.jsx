import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tutorial } from 'zooniverse-react-components';
import { browserHistory } from 'react-router';
import { config } from '../config';

import oauth from 'panoptes-client/lib/oauth';

import {
  setRotation, setContrast, resetView,
  togglePreviousMarks, setViewerState,
  MARKS_STATE, SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import { fetchGuide, GUIDE_STATUS } from '../ducks/field-guide';
import { fetchTutorial, TUTORIAL_STATUS } from '../ducks/tutorial';
import { toggleFavorite, fetchSubject } from '../ducks/subject';
import { toggleDialog } from '../ducks/dialog';
import { VARIANT_TYPES, toggleVariant, setVariant } from '../ducks/splits';
import { fetchWorkflow, WORKFLOW_INITIAL_STATE, WORKFLOW_STATUS } from '../ducks/workflow';
import { saveClassificationInProgress } from '../ducks/classifications';
import { checkEmergencySave, emergencyLoadWorkInProgress, clearEmergencySave } from '../ducks/emergency-save'
import { Utility, KEY_CODES } from '../lib/Utility';

import SubjectViewer from './SubjectViewer';

import Navigator from './Navigator';
import ClassificationPrompt from '../components/ClassificationPrompt';
import FilmstripViewer from '../components/FilmstripViewer';
import FavoritesButton from '../components/FavoritesButton';
import Popup from '../components/Popup';
import ShowMetadata from '../components/ShowMetadata';
import CollectionsContainer from './CollectionsContainer';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import DialogOfContinuation from '../components/DialogOfContinuation';
import Divider from '../images/img_divider.png';
import FieldGuide from '../components/FieldGuide';
import SubmitClassificationForm from '../components/SubmitClassificationForm';
import CribSheet from '../components/CribSheet';

const ROTATION_STEP = 90;

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);

    // Bind events
    this.useAnnotationTool = this.useAnnotationTool.bind(this);
    this.useRotate90 = this.useRotate90.bind(this);
    this.useResetImage = this.useResetImage.bind(this);
    this.togglePreviousMarks = this.togglePreviousMarks.bind(this);
    this.useContrast = this.useContrast.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.showMetadata = this.showMetadata.bind(this);
    this.showCollections = this.showCollections.bind(this);
    this.showShortcuts = this.showShortcuts.bind(this);
    this.showTutorial = this.showTutorial.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.prepareSubmitClassificationForm = this.prepareSubmitClassificationForm.bind(this);
    this.toggleUserVariant = this.toggleUserVariant.bind(this);
    this.toggleFieldGuide = this.toggleFieldGuide.bind(this);
    this.saveCurrentClassification = this.saveCurrentClassification.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.toggleCribDraw = this.toggleCribDraw.bind(this);

    this.state = {
      popup: null,
      showSignInPrompt: true,
    };
  }

  //----------------------------------------------------------------

  componentDidMount() {
    const dispatch = this.props.dispatch;
    
    dispatch(fetchGuide());
    document.addEventListener('keyup', this.handleKeyUp);

    //FUTURE UPDATE: 
    //Select only one workflow
    //----------------------------------------------------------------
    //dispatch(fetchWorkflow(config.zooniverseLinks.collabWorkflowId)).then(() => {
    //  dispatch(fetchSubject());
    //  dispatch(setVariant(VARIANT_TYPE.COLLABORATIVE));
    //});
    //----------------------------------------------------------------
    
    //Saved Progress Check
    //----------------------------------------------------------------
    if (checkEmergencySave(this.props.user)) {  //Check if there's an emergency save.
      dispatch(toggleDialog(<DialogOfContinuation dispatch={dispatch} />, false, false));
    } else if (this.props.user && localStorage.getItem(`${this.props.user.id}.manual_save_classificationID`)) {  //Check if the user has manually saved progress. (Emergency save trumps manual save.)
      dispatch(toggleDialog(<ClassificationPrompt />, false, true));
    }
    //----------------------------------------------------------------
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workflowData && nextProps.preferences && nextProps.tutorialStatus === TUTORIAL_STATUS.IDLE) {
      this.props.dispatch(fetchTutorial(nextProps.workflowData));

      if (this.context.googleLogger) {
        this.context.googleLogger.remember({ workflowID: nextProps.workflowData.id });
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
    document.removeEventListener('keyup', this.handleKeyUp);
    this.context.googleLogger && this.context.googleLogger.forget(['subjectID']);
  }

  render() {
    //JULY UPDATE:
    //Allow users to select their workflow
    //----------------------------------------------------------------
    const startWorkflow = (workflow_id, variant_type) => {
      this.props.dispatch(fetchWorkflow(workflow_id)).then(() => {
        this.props.dispatch(fetchSubject());
        this.props.dispatch(setVariant(variant_type));
      });
    }
    
    if (this.props.workflowStatus === WORKFLOW_STATUS.IDLE) {
      return (
        <main className="app-content classifier-page-panel flex-column flex-center">
          <div className="header-panel">Choose how you would like to transcribe</div>
          <div className="button-panel">
            <button className="white-green button" onClick={() => { startWorkflow(config.zooniverseLinks.workflowId, VARIANT_TYPES.INDIVIDUAL) }}>
              Solo
            </button>
            <button className="white-green button" onClick={() => { startWorkflow(config.zooniverseLinks.collabWorkflowId, VARIANT_TYPES.COLLABORATIVE) }}>
              Collaborative
            </button>
          </div>
          <div className="details-panel">
            <p>When we first launched this project, we ran an A/B experiment to research what method of transcription produces the highest-quality results. You can read more about this ongoing research on the project <a href="https://www.bpl.org/distinction/tag/anti-slavery-manuscripts/" target="blank" rel="noopener noreferrer">blog.</a></p>
            <p>Now that the experiment has finished, we are curious to know what you, our volunteers, think of each method. For the next month, you will have the option to choose between <b>Independent</b> and <b>Collaborative</b> transcription methods.</p>
            <p>The <b>Collaborative</b> option allows you to see other volunteers' transcriptions. The <b>Independent</b> option allows volunteers to transcribe independently. Please read the tutorial before participating in an unfamiliar method, as the transcription process differs for each method.</p>
            <p>We'd love to hear your thoughts about the methods: you can give us feedback on the workflows <a href="https://goo.gl/forms/j7HaJMMTPkV4kd5w2" target="blank" rel="noopener noreferrer">here</a>; additionally, you can visit the project <a href="https://www.zooniverse.org/projects/bostonpubliclibrary/anti-slavery-manuscripts/talk" target="blank" rel="noopener noreferrer">here</a>Talk</a> board to chat with other volunteers about this process and ask questions of the research team.</p>
            <p>Thanks, and happy transcribing!</p>
        </div>
          
          {(this.state.popup === null) ? null :
            <Popup onClose={this.closePopup.bind(this)}>
              {this.state.popup}
            </Popup>
          }
          
          {this.renderSignInReminder()}
        </main>
      );
    }
    //----------------------------------------------------------------
    
    //Status Checks
    //----------------------------------------------------------------
    if (this.props.workflowStatus === WORKFLOW_STATUS.FETCHING) {
      return (
        <main className="app-content classifier-page-panel flex-column flex-center">
          <div className="loading-spinner"></div>
        </main>
      );
    }
    
    //Sanity Check: cannot proceed with the rest of the render code unless the
    //Workflow is successfully fetched.
    if (this.props.workflowStatus !== WORKFLOW_STATUS.READY) {
      return (
        <main className="app-content classifier-page-panel flex-column flex-center">
          ...
        </main>
      );
    }
    //----------------------------------------------------------------

    const activeCrop = this.props.viewerState === SUBJECTVIEWER_STATE.CROPPING ? 'active-crop' : '';
    const disableTranscribe = this.props.selectedAnnotation !== null;
    const isAdmin = this.props.user && this.props.user.admin;
    const shownMarksClass = (MARKS_STATE.ALL === this.props.shownMarks) ? 'fa fa-eye' :
      (MARKS_STATE.USER === this.props.shownMarks) ? 'fa fa-eye-slash' : 'fa fa-eye-slash grey';

    const currentMode = this.props.variant === VARIANT_TYPES.COLLABORATIVE ?
      'Collaborative' :
      'Solo';
    const toggleMode = this.props.variant === VARIANT_TYPES.INDIVIDUAL ?
      'Collaborative' :
      'Solo';

    return (
      <main className="app-content classifier-page flex-row">
        <div className="project-background"></div>
        <section id="help-column" className="help-pane">
          <div>
            <h2>directions</h2>
            <p>
              Using the Transcribe tool, click under the start and end of a line
              of text, then add your transcription.

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
              <button className="white-red button" onClick={this.showTutorial}>Tutorial</button>
            )}
            {this.props.guide && this.props.guideStatus === GUIDE_STATUS.READY && (
              <button className="white-red button" onClick={this.toggleFieldGuide}>Field Guide</button>
            )}
            {this.props.user && (
              <button className={`${activeCrop} white-red button`} onClick={this.toggleCribDraw}>Your Crib Sheet</button>
            )}

            <img className="divider" role="presentation" src={Divider} />

            {this.props.user && (
              <button className="white-green button" onClick={this.saveCurrentClassification}>Save Progress</button>
            )}

            <button className="white-green button" onClick={this.prepareSubmitClassificationForm}>Finish</button>
          </div>
        </section>

        <FilmstripViewer />

        <SubjectViewer currentSubject={this.props.currentSubject} />
        <section className="classifier-controls">
          <div>
            {this.props.goldStandardMode && (
              <div className="gold-standard">
                <i className="fa fa-star" />
                <span>Gold Standard Mode</span>
              </div>
            )}
            <h2>Navigator</h2>
            <Navigator />
          </div>
          <img className="divider" role="presentation" src={Divider} />
          <div className="classifier-toolbar">
            <h2>Toolbar</h2>

            <button
              disabled={disableTranscribe}
              className={(this.props.viewerState === SUBJECTVIEWER_STATE.ANNOTATING) ? 'flat-button block selected' : 'flat-button block'}
              onClick={this.useAnnotationTool}
            >
              <span className="classifier-toolbar__icon">
                <i className={`fa fa-plus-circle ${disableTranscribe && 'disable-icon'}`} />
              </span>
              <span>Transcribe</span>
            </button>

            <button className="flat-button block" onClick={this.useRotate90}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-repeat" />
              </span>
              <span>Rotate 90&deg;</span>
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
              <span>Invert Colors</span>
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

            <button className="flat-button block" onClick={this.showShortcuts}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-keyboard-o" />
              </span>
              <span>Shortcuts</span>
            </button>

            {/*  //TODO: Will, is this still necessary?
            (!(isAdmin && this.props.previousAnnotations && this.props.previousAnnotations.length > 0)) ? null : (
              <button
                className="flat-button block"
                onClick={this.toggleUserVariant}
              >
                <span className="classifier-toolbar__icon">
                  <i className="fa fa-arrows-h" />
                </span>
                <span>Enter {toggleMode} Mode</span>
              </button>
            )*/}
            
            <img className="divider" role="presentation" src={Divider} />
            
            <div>Currently working in <b>{currentMode}</b> mode</div>
            
            <button
              className="flat-button block"
              onClick={()=>{
                const confirmed = confirm('WARNING: You will lose all current progress (including saved work) if you switch modes. Is this OK?');
                if (confirmed) {
                  //If the use chooses to switch modes, remove ALL saved progress to prevent confusion.
                  if (this.props.user) {
                    const id = localStorage.getItem(`${this.props.user.id}.manual_save_classificationID`);
                    localStorage.removeItem(`${this.props.user.id}.manual_save_classificationID`);
                    localStorage.removeItem(`${this.props.user.id}.manual_save_workflowID`);
                    localStorage.removeItem(`${this.props.user.id}.manual_save_variant`);
                  }
                  this.props.dispatch(clearEmergencySave());
                  location.reload();
                }
              }}
            >
              <span className="classifier-toolbar__icon">
                <i className="fa fa-arrows-h" />
              </span>
              <span>Switch to {toggleMode}</span>
            </button>
            
            <div>Warning: switching modes will reset all your current work.</div>

          </div>
        </section>

        {(this.state.popup === null) ? null :
          <Popup onClose={this.closePopup.bind(this)}>
            {this.state.popup}
          </Popup>
        }
        
        {/*
        //FUTURE UPDATE: 
        //Select only one workflow
        //----------------------------------------------------------------
        this.renderSignInReminder()
        //----------------------------------------------------------------
        */}

      </main>
    );
  }

  //----------------------------------------------------------------
  
  renderSignInReminder() {
    if (!(this.props.initialised && !this.props.user && this.state.showSignInPrompt)) return null;
    
    return (
      <Popup
        className="popup-sign-in-prompt"
        onClose={() => { this.setState({ showSignInPrompt: false }); }}
      >
        <div>
          Before you begin transcribing, please sign in or create an account by clicking the button below:
        </div>
        <div>
          <button
            className="green sign-in button"
            onClick={() => {
              const computeRedirectURL = (window) => {
                const { location } = window;
                return location.origin || `${location.protocol}//${location.hostname}:${location.port}`;
              };
              oauth.signIn(computeRedirectURL(window));
            }}
          >
            Sign In
          </button>
          <button
            className="continue"
            onClick={() => { this.setState({ showSignInPrompt: false }); }}
          >
            Continue without signing in
          </button>
        </div>
      </Popup>
    );
  }
  
  //----------------------------------------------------------------

  closePopup() {
    this.setState({ popup: null });
  }

  handleKeyUp(e) {
    if (this.props.selectedAnnotation === null) {
      if (Utility.getKeyCode(e) === KEY_CODES.A) {
        if (this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING && !this.props.selectedAnnotation) {
          this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
        } else {
          this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.NAVIGATING));
        }
      }
      if (Utility.getKeyCode(e) === KEY_CODES.M) {
        this.togglePreviousMarks();
      }
    }
  }

  //----------------------------------------------------------------

  useAnnotationTool() {
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

  toggleCribDraw() {
    this.props.dispatch(toggleDialog(<CribSheet />, false, false, 'Crib Sheet'));
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

  toggleUserVariant() {
    const currentVariant = this.props.variant;
    this.props.dispatch(toggleVariant(currentVariant));
  }

  showMetadata() {
    const metadata = (this.props.currentSubject && this.props.currentSubject.metadata) || {};
    this.props.dispatch(toggleDialog(
      <ShowMetadata metadata={metadata} />, true, false, 'Subject Info'));
  }

  showShortcuts() {
    this.setState({ popup: <KeyboardShortcuts /> });
  }

  toggleFieldGuide() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'open-field-guide' });
    }

    this.props.dispatch(toggleDialog(
      <FieldGuide guide={this.props.guide} icons={this.props.icons} />, false, false, 'Field Guide'));
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

  saveCurrentClassification() {
    this.props.dispatch(saveClassificationInProgress());
  }
}

ClassifierContainer.propTypes = {
  dispatch: PropTypes.func,
  //--------
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    metadata: PropTypes.object,
  }),
  dispatch: PropTypes.func,
  favoriteSubject: PropTypes.bool,
  goldStandardMode: PropTypes.bool,
  guide: PropTypes.object,
  icons: PropTypes.object,
  initialised: PropTypes.bool,
  guideStatus: PropTypes.string,
  rotation: PropTypes.number,
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
  }),
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  selectedAnnotation: PropTypes.shape({
    status: PropTypes.string,
  }),
  shownMarks: PropTypes.number,
  tutorial: PropTypes.shape({
    steps: PropTypes.array,
  }),
  tutorialStatus: PropTypes.string,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    id: PropTypes.string,
  }),
  variant: PropTypes.string,
  viewerState: PropTypes.string,
  workflowData: PropTypes.object,
  workflowStatus: PropTypes.string,
};

ClassifierContainer.defaultProps = {
  dispatch: () => {},
  //--------
  currentSubject: null,
  favoriteSubject: false,
  goldStandardMode: false,
  guide: null,
  guideStatus: GUIDE_STATUS.IDLE,
  icons: null,
  initialised: false,
  preferences: null,
  previousAnnotations: [],
  rotation: 0,
  selectedAnnotation: null,
  shownMarks: 0,
  tutorial: null,
  tutorialStatus: TUTORIAL_STATUS.IDLE,
  user: null,
  variant: VARIANT_TYPES.INDIVIDUAL,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
  workflowData: WORKFLOW_INITIAL_STATE.data,
  workflowStatus: WORKFLOW_INITIAL_STATE.status,
};

ClassifierContainer.contextTypes = {
  googleLogger: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentSubject: state.subject.currentSubject,
    favoriteSubject: state.subject.favorite,
    goldStandardMode: state.workflow.goldStandardMode,
    guide: state.fieldGuide.guide,
    guideStatus: state.fieldGuide.status,
    icons: state.fieldGuide.icons,
    initialised: state.login.initialised,
    preferences: state.project.userPreferences,
    previousAnnotations: state.previousAnnotations.marks,
    rotation: state.subjectViewer.rotation,
    selectedAnnotation: state.annotations.selectedAnnotation,
    shownMarks: state.subjectViewer.shownMarks,
    tutorial: state.tutorial.data,
    tutorialStatus: state.tutorial.status,
    user: state.login.user,
    variant: state.splits.variant,
    viewerState: state.subjectViewer.viewerState,
    workflowData: state.workflow.data,
    workflowStatus: state.workflow.status,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
