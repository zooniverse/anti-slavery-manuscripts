import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  setRotation, setContrast, resetView,
  togglePreviousMarks, setViewerState,
  SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import { toggleFavorite } from '../ducks/subject';
import { selectAnnotation, unselectAnnotation } from '../ducks/annotations';
import { toggleDialog } from '../ducks/dialog';

import SubjectViewer from './SubjectViewer';

import Navigator from './Navigator';
import FilmstripViewer from '../components/FilmstripViewer';
import FavoritesButton from '../components/FavoritesButton';
import Popup from '../components/Popup';
import SelectedAnnotation from '../components/SelectedAnnotation';
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
    this.closeAnnotation = this.closeAnnotation.bind(this);

    this.state = {
      annotation: null,
      popup: null,
    }
  }

  //----------------------------------------------------------------

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
            <button href="#" className="white-green button">Done</button>
            <button href="#" className="green button">Done &amp; Talk</button>
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

        {this.state.annotation}

      </main>
    );
  }

  //----------------------------------------------------------------

  componentWillReceiveProps(next) {
    if (!this.props.selectedAnnotation && next.selectedAnnotation) {
      this.setState({
        annotation: <SelectedAnnotation annotation={next.selectedAnnotation} onClose={this.closeAnnotation} />
      });
    }
  }

  //----------------------------------------------------------------

  closeAnnotation() {
    this.setState({ annotation: null });
    this.props.dispatch(unselectAnnotation());
  }

  closePopup() {
    this.setState({ popup: null });
  }

  //----------------------------------------------------------------

  useAnnotationTool() {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
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
  scaling: PropTypes.number,
  viewerState: PropTypes.string,
  selectedAnnotation: PropTypes.shape({
    text: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};
ClassifierContainer.defaultProps = {
  rotation: 0,
  scaling: 1,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
  selectedAnnotation: null,
};
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.login.user,
    favoriteSubject: state.subject.favorite,
    currentSubject: state.subject.currentSubject,
    rotation: state.subjectViewer.rotation,
    scaling: state.subjectViewer.scaling,
    viewerState: state.subjectViewer.viewerState,
    selectedAnnotation: state.annotations.selectedAnnotation,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
