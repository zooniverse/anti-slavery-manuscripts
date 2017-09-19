/*
Subject Viewer
--------------

This component allows users to view a single Subject image (i.e. the SVGImage)
and navigate (pan and zoom) the Subject using the mouse.

Intended functionality:
* Display a single image
* When in 'Navigating' mode, click & drag mouse to pan the Subject Image.
* When in 'Navigating' mode, mouse wheel to zoom in/out.
* (TODO) When in 'Annotating' mode, mouse click to place a sequence of
  annotation marks, then click again (on the last annotation mark) to finish
  the sequence.

NOTE: we've adjusted the (0,0) origin of the SVG to the CENTRE, instead of the
default top left. Please review SubjectViewer.jsx, SVGImage.jsx and
AnnotationsPane.jsx for details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FilmstripViewer from '../components/FilmstripViewer';
import SVGImage from '../components/SVGImage';
import AnnotationsPane from '../components/AnnotationsPane';
import ZoomTools from '../components/ZoomTools';
import { Utility } from '../lib/Utility';
import { fetchSubject, SUBJECT_STATUS } from '../ducks/subject';
import { getSubjectLocation } from '../lib/get-subject-location';
import SelectedAnnotation from '../components/SelectedAnnotation';
import { fetchAggregations } from '../ducks/aggregations';

import {
  setRotation, setScaling, setTranslation, resetView,
  setViewerState, updateViewerSize, updateImageSize,
  SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';

import {
  addAnnotationPoint, completeAnnotation, selectAnnotation,
  selectPreviousAnnotation, unselectAnnotation,
  unselectPreviousAnnotation, ANNOTATION_STATUS
} from '../ducks/annotations';

const INPUT_STATE = {
  IDLE: 0,
  ACTIVE: 1,
}

const ZOOM_STEP = 0.1;

//Add ?dev=1 to the URL to enable DEV_MODE
const DEV_MODE = window.location && /(\?|&)dev(=|&|$)/ig.test(window.location.search);

class SubjectViewer extends React.Component {
  constructor(props) {
    super(props);

    //HTML element refs.
    this.section = null;
    this.svg = null;
    this.svgImage = null;

    //Events!
    this.updateSize = this.updateSize.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.useZoomIn = this.useZoomIn.bind(this);
    this.useZoomOut = this.useZoomOut.bind(this);
    this.usePanTool = this.usePanTool.bind(this);

    //Other functions
    this.getBoundingBox = this.getBoundingBox.bind(this);
    this.fetchSubject = this.fetchSubject.bind(this);
    this.getPointerXY = this.getPointerXY.bind(this);
    this.getPointerXYOnImage = this.getPointerXYOnImage.bind(this);
    this.onCompleteAnnotation = this.onCompleteAnnotation.bind(this);
    this.onSelectAnnotation = this.onSelectAnnotation.bind(this);
    this.onSelectPreviousAnnotation = this.onSelectPreviousAnnotation.bind(this);
    this.closeAnnotation = this.closeAnnotation.bind(this);

    //Mouse or touch pointer
    this.pointer = {
      start: { x: 0, y: 0 },
      now: { x: 0, y: 0 },
      state: INPUT_STATE.IDLE,
    };

    //Misc
    this.tmpTransform = null;

    //State
    this.state = {
      annotation: null,
      pointerXYOnImage: null,
    };
  }

  //----------------------------------------------------------------

  render() {
    const transform = `scale(${this.props.scaling}) translate(${this.props.translationX}, ${this.props.translationY}) rotate(${this.props.rotation}) `;
    let subjectLocation = undefined;
    const cursor = this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING ? 'cursor-move' : '';

    if (this.props.currentSubject) subjectLocation = getSubjectLocation(this.props.currentSubject, this.props.frame).src;

    return (
      <section className={`subject-viewer ${cursor}`} ref={(c)=>{this.section=c}}>

        <ZoomTools viewerState={this.props.viewerState} usePanTool={this.usePanTool} useZoomIn={this.useZoomIn} useZoomOut={this.useZoomOut} />

        {this.state.annotation}

        <svg
          ref={(c)=>{this.svg=c}}
          viewBox="0 0 100 100"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        >
          <g transform={transform}>
            {subjectLocation && (
              <SVGImage
                ref={(c) => { this.svgImage = c; }}
                src={subjectLocation}
                onLoad={this.onImageLoad}
                contrast={this.props.contrast}
              />
            )}
            <AnnotationsPane
              imageSize={this.props.imageSize}
              annotationInProgress={this.props.annotationInProgress}
              annotations={this.props.annotations}
              frame={this.props.frame}
              onCompleteAnnotation={this.onCompleteAnnotation}
              onSelectAnnotation={this.onSelectAnnotation}
              onSelectPreviousAnnotation={this.onSelectPreviousAnnotation}
              previousAnnotations={this.props.previousAnnotations}
              showPreviousMarks={this.props.showPreviousMarks}
            />
          </g>
          {(!DEV_MODE) ? null :
            <g className="developer-grid" transform={transform + `translate(${(-this.props.imageSize.width/2)},${(-this.props.imageSize.height/2)})`}>
              {(()=>{
                const MIN_VAL = 0;
                const MAX_VAL = 2000;
                const STEP_VAL = 100;
                const STYLE = { stroke: '#fff', strokeWidth: 2 };
                const STYLE_DIVISOR = { stroke: '#c99', strokeWidth: 2 };
                const STYLE_ORIGIN = { stroke: '#c33', strokeWidth: 2 };
                const STYLE_TEXT = { fill: '#c33', fontSize: '32px' }
                const STYLE_TEXT_SHADOW = { fill: '#fff', fontSize: '32px' }
                const arr = []
                for (let v = MIN_VAL; v <= MAX_VAL; v += STEP_VAL) {
                  let styl = (v % 500 === 0) ? STYLE_DIVISOR : STYLE;
                  arr.push(<line x1={v} y1={MIN_VAL} x2={v} y2={MAX_VAL} style={styl} />);
                  arr.push(<line x1={MIN_VAL} y1={v} x2={MAX_VAL} y2={v} style={styl} />);
                }
                arr.push(<line x1={-STEP_VAL} y1={0} x2={STEP_VAL} y2={0} style={STYLE_ORIGIN} />);
                arr.push(<line x1={0} y1={-STEP_VAL} x2={0} y2={STEP_VAL} style={STYLE_ORIGIN} />);
                arr.push(<text x={2} y={0} style={STYLE_TEXT_SHADOW}>(0,0)</text>);
                arr.push(<text x={-2} y={0} style={STYLE_TEXT_SHADOW}>(0,0)</text>);
                arr.push(<text x={0} y={0} style={STYLE_TEXT}>(0,0)</text>);
                return arr;
              })()}
            </g>
          }
          <defs>
            <filter id="svg-invert-filter">
              <feComponentTransfer>
                <feFuncR type="table" tableValues="1 0"/>
                <feFuncG type="table" tableValues="1 0"/>
                <feFuncB type="table" tableValues="1 0"/>
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
      </section>
    );
  }

  //----------------------------------------------------------------

  componentDidMount() {
    //Make sure we monitor visible size of Subject Viewer.
    window.addEventListener('resize', this.updateSize);
    this.updateSize();
    this.fetchSubject();
    this.props.dispatch(fetchAggregations());
  }

  componentWillReceiveProps(next) {
    if (!this.props.selectedAnnotation && next.selectedAnnotation) {
      this.setState({
        annotation: <SelectedAnnotation annotation={next.selectedAnnotation} onClose={this.closeAnnotation} previousAnnotationSelected={next.previousAnnotationSelected} />
      });
    }
  }

  componentWillUnmount() {
    //Cleanup
    window.removeEventListener('resize', this.updateSize);
  }

  fetchSubject() {
    this.props.dispatch(fetchSubject());
  }

  //----------------------------------------------------------------

  /*  Update the size of the SVG element; this requires manual tweaking.
   */
  updateSize() {
    if (!this.section || !this.svg) return;

    const ARBITRARY_OFFSET = 2;
    const w = this.section.offsetWidth - ARBITRARY_OFFSET;
    const h = this.section.offsetHeight - ARBITRARY_OFFSET;

    //Note: if .offsetWidth/.offsetHeight gives problems, use
    //.getBoundingClientRect() or .clientHeight/.clientWidth .

    //Use the SVG viewbox to fit the 'canvas' to the <section> container, then
    //center the view on coordinates 0, 0.
    this.svg.setAttribute('viewBox', `${-w/2} ${(-h/2)} ${w} ${h}`);
    this.svg.style.width = w + 'px';
    this.svg.style.height = h + 'px';

    //Record the changes.
    const boundingBox = this.getBoundingBox();
    const svgW = boundingBox.width;
    const svgH = boundingBox.height;
    this.props.dispatch(updateViewerSize(svgW, svgH));
  }

  /*  Once the Subject has been loaded properly, fit it into the SVG Viewer.
   */
  onImageLoad() {
    if (this.svgImage.image) {
      const imgW = (this.svgImage.image.width) ? this.svgImage.image.width : 1;
      const imgH = (this.svgImage.image.height) ? this.svgImage.image.height : 1;

      this.props.dispatch(updateImageSize(imgW, imgH));
      this.props.dispatch(resetView());
    }
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

  //----------------------------------------------------------------

  onMouseDown(e) {
    if (this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) {
      const pointerXY = this.getPointerXY(e);
      this.pointer.state = INPUT_STATE.ACTIVE;
      this.pointer.start = { x: pointerXY.x, y: pointerXY.y };
      this.pointer.now = { x: pointerXY.x, y: pointerXY.y };
      this.tmpTransform = {
        scale: this.props.scaling,
        translateX: this.props.translationX,
        translateY: this.props.translationY,
      };
      return Utility.stopEvent(e);
    } else if (this.props.viewerState === SUBJECTVIEWER_STATE.ANNOTATING) {
      return Utility.stopEvent(e);
    }
  }

  onMouseUp(e) {
    if (this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) {
      const pointerXY = this.getPointerXY(e);
      this.pointer.state = INPUT_STATE.IDLE;
      this.pointer.now = { x: pointerXY.x, y: pointerXY.y };
      this.tmpTransform = false;
      return Utility.stopEvent(e);
    } else if (this.props.viewerState === SUBJECTVIEWER_STATE.ANNOTATING) {
      const pointerXYOnImage = this.getPointerXYOnImage(e);
      this.props.dispatch(addAnnotationPoint(pointerXYOnImage.x, pointerXYOnImage.y));
    }
  }

  onMouseMove(e) {
    if (this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) {
      const pointerXY = this.getPointerXY(e);
      this.pointer.now = { x: pointerXY.x, y: pointerXY.y };
      if (this.pointer.state === INPUT_STATE.ACTIVE && this.tmpTransform) {
        const pointerDelta = {
          x: this.pointer.now.x - this.pointer.start.x,
          y: this.pointer.now.y - this.pointer.start.y
        };
        this.props.dispatch(setTranslation(
          this.tmpTransform.translateX + pointerDelta.x / this.tmpTransform.scale,
          this.tmpTransform.translateY + pointerDelta.y / this.tmpTransform.scale,
        ));
      }
      return Utility.stopEvent(e);
    }
  }

  onMouseLeave(e) {
    if (this.props.viewerState === SUBJECTVIEWER_STATE.NAVIGATING) {
      this.pointer.state = INPUT_STATE.IDLE;
      return Utility.stopEvent(e);
    }
  }

  /*  Triggers when the user clicks on the final node/point of an
      annotation-in-progress.
   */
  onCompleteAnnotation(point) {
    this.props.dispatch(completeAnnotation(point));
  }

  closeAnnotation() {
    this.setState({ annotation: null });
    if (this.props.previousAnnotationSelected) {
      this.props.dispatch(unselectPreviousAnnotation());
    } else {
      this.props.dispatch(unselectAnnotation());
    }
  }

  /*  Triggers when the user clicks on a specific line of annotation.
   */
  onSelectAnnotation(indexOfAnnotation) {
    //Don't allow an annotation to be selected if there's one in progress,
    //otherwise it gets confusing.
    if (this.props.annotationInProgress === null) {
      this.props.dispatch(selectAnnotation(indexOfAnnotation));
    }
  }

  onSelectPreviousAnnotation(data) {
    if (this.props.annotationInProgress === null) {
      this.props.dispatch(selectPreviousAnnotation(data));
    }
  }

  //----------------------------------------------------------------

  getBoundingBox() {
    const boundingBox = (this.svg && this.svg.getBoundingClientRect)
      ? this.svg.getBoundingClientRect()
      : { left: 0, top: 0, width: 1, height: 1 };
    return boundingBox;
  }


  /*  Gets the pointer coordinates, relative to the Subject Viewer.
   */
  getPointerXY(e) {
    const boundingBox = this.getBoundingBox();
    let clientX = 0;
    let clientY = 0;
    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX &&
        e.touches[0].clientY) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    //SVG scaling: usually not an issue.
    const sizeRatioX = 1;
    const sizeRatioY = 1;

    const inputX = (clientX - boundingBox.left) * sizeRatioX;
    const inputY = (clientY - boundingBox.top) * sizeRatioY;

    return { x: inputX, y: inputY };
  }

  /*  Gets the pointer coordinates, relative to the Subject image.
   */
  getPointerXYOnImage(e) {
    //Get the coordinates of the pointer on the Subject Viewer first.
    const pointerXY = this.getPointerXY(e);
    let inputX = pointerXY.x;
    let inputY = pointerXY.y;

    //Safety checks
    if (this.props.scaling === 0) {
      alert('ERROR: unexpected issue with Subject image scaling.');
      console.error('ERROR: Invalid value - SubjectViewer.props.scaling is 0.');
      return pointerXY;
    }

    //Compensate for the fact that the SVG Viewer has an offset that makes its
    //centre (not its top-left) is the (0,0) origin.
    inputX = inputX - this.props.viewerSize.width / 2;
    inputY = inputY - this.props.viewerSize.height / 2;

    //Compensate for SVG transformations: scaling, then translations (in order)
    inputX = inputX / this.props.scaling - this.props.translationX;
    inputY = inputY / this.props.scaling - this.props.translationY;

    //Compensate for SVG transformation: rotation
    const rotation = -this.props.rotation / 180 * Math.PI;
    const tmpX = inputX;
    const tmpY = inputY;
    inputX = tmpX * Math.cos(rotation) - tmpY * Math.sin(rotation);
    inputY = tmpX * Math.sin(rotation) + tmpY * Math.cos(rotation);

    //Compensate for the Subject image having an offset that aligns its centre
    //to the (0,0) origin
    inputX = inputX + this.props.imageSize.width / 2;
    inputY = inputY + this.props.imageSize.height / 2;

    return { x: inputX, y: inputY };
  }
}

SubjectViewer.propTypes = {
  dispatch: PropTypes.func,
  //--------
  currentSubject: PropTypes.shape({
    src: PropTypes.string,
  }),
  contrast: PropTypes.bool,
  dispatch: PropTypes.func,
  frame: PropTypes.number,
  imageSize: PropTypes.object,
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,
  viewerState: PropTypes.string,
  viewerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  //--------
  annotationsStatus: PropTypes.string,
  annotationInProgress: PropTypes.shape({
    text: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  }),
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      points: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      })),
    })
  ),
  showPreviousMarks: PropTypes.bool,
  selectedPreviousAnnotation: PropTypes.shape({
    text: PropTypes.arrayOf(PropTypes.string),
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  }),
  selectedAnnotation: PropTypes.shape({
    text: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  }),
};
SubjectViewer.defaultProps = {
  contrast: false,
  currentSubject: null,
  frame: 0,
  //--------
  imageSize: {
    width: 0,
    height: 0,
  },
  previousAnnotations: [],
  rotation: 0,
  scaling: 1,
  selectedAnnotation: null,
  selectedPreviousAnnotation: null,
  translationX: 0,
  translationY: 0,
  viewerState: SUBJECTVIEWER_STATE.NAVIGATING,
  viewerSize: {
    width: 0,
    height: 0,
  },
  imageSize: {
    width: 0,
    height: 0,
  },
  //--------
  annotationsStatus: ANNOTATION_STATUS.IDLE,
  annotationInProgress: null,
  annotations: [],
  showPreviousMarks: true,
};
const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  const sv = state.subjectViewer;
  const anno = state.annotations;
  return {
    currentSubject: state.subject.currentSubject,
    contrast: sv.contrast,
    //--------
    frame: sv.frame,
    previousAnnotations: state.aggregations.data,
    rotation: sv.rotation,
    scaling: sv.scaling,
    translationX: sv.translationX,
    translationY: sv.translationY,
    viewerState: sv.viewerState,
    viewerSize: sv.viewerSize,
    imageSize: sv.imageSize,
    //--------
    annotationsStatus: anno.status,
    annotationInProgress: anno.annotationInProgress,
    annotations: anno.annotations,
    previousAnnotationSelected: anno.previousAnnotationSelected,
    showPreviousMarks: sv.showPreviousMarks,
    selectedAnnotation: state.annotations.selectedAnnotation,
    selectedPreviousAnnotation: state.aggregations.selectedAnnotation,
  };
};
export default connect(mapStateToProps)(SubjectViewer);  //Connects the Component to the Redux Store
