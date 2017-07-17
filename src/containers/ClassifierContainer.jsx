import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  setRotation, setScaling,
  setViewerState, SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import SubjectViewer from './SubjectViewer';

import TmpNavigator from '../images/classify-navigator-placeholder.png';
import Divider from '../images/img_divider.png';
import TOOLBAR_CONTROLS from '../lib/toolbar-controls';

const ZOOM_STEP = 0.1;
  
class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.useZoomIn = this.useZoomIn.bind(this);
    this.useZoomOut = this.useZoomOut.bind(this);
    this.usePanTool = this.usePanTool.bind(this);
    this.useRotate90 = this.useRotate90.bind(this);
  }

  render() {
    return (
      <main className="app-content classifier-page">
        <div className="project-background"></div>
        <section className="help-pane">
          <div className="help-directions">
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
            <img className="classifier-divider" role="presentation" src={Divider} />
            <button href="#" className="white-green button">Done</button>
            <button href="#" className="green button">Done &amp; Talk</button>
          </div>
        </section>
        <SubjectViewer />
        <section className="classifier-controls">
          <div className="classifier-navigator">
            <h2>Navigator</h2>
            <img className="" role="presentation" src={TmpNavigator} />
          </div>
          <img className="classifier-divider" role="presentation" src={Divider} />
          <div className="classifier-toolbar">
            <h2>Toolbar</h2>
            
            <button className={(this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) ? 'flat-button block selected' : 'flat-button block'}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-arrows" />
              </span>
              <span>Pan image</span>
            </button>
            
            <button className="flat-button block" onClick={this.useZoomIn}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-plus" />
              </span>
              <span>Zoom in</span>
            </button>
            
            <button className="flat-button block" onClick={this.useZoomOut}>
              <span className="classifier-toolbar__icon">
                <i className="fa fa-minus" />
              </span>
              <span>Zoom out</span>
            </button>
            
            {Object.keys(TOOLBAR_CONTROLS).map((key, i) => {
              return (
                <div className="block" key={i}>
                  <span className="classifier-toolbar__icon">
                    <i className={`${TOOLBAR_CONTROLS[key]}`} />
                  </span>
                  <span>{key}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
  
  useZoomIn() {
    console.log('x'.repeat(80));
    this.props.dispatch(setScaling(this.props.scaling + ZOOM_STEP));
  }

  useZoomOut() {
    this.props.dispatch(setScaling(this.props.scaling - ZOOM_STEP));
  }

  usePanTool() {
    
  }

  useRotate90() {
    
  }
}

ClassifierContainer.propTypes = {
  dispatch: PropTypes.func,
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  viewerState: PropTypes.string,
};
ClassifierContainer.defaultProps = {
  rotation: 0,
  scaling: 1,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
};
const mapStateToProps = (state, ownProps) => {
  const store = state.subjectViewer;
  return {
    rotation: store.rotation,
    scaling: store.scaling,
    viewerState: store.viewerState,
  };
};
export default connect(mapStateToProps)(ClassifierContainer);
