/*
Annotations Pane
----------------

TODO: Description

NOTE: we've adjusted the (0,0) origin of the SVG to the CENTRE, instead of the
default top left. Please review SubjectViewer.jsx, SVGImage.jsx and
AnnotationsPane.jsx for details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Utility } from '../lib/Utility';
import PendingAnnotation from './PendingAnnotation';
import { VARIANT_TYPES } from '../ducks/splits';
import { MARKS_STATE } from '../ducks/subject-viewer';

const CONSENSUS_LINE = { text: 'This line has been completed.', width: 310 };
const TRANSCRIBED_LINE = { text: 'This line has existing transcriptions.', width: 360 };

class AnnotationsPane extends React.Component {
  constructor(props) {
    super(props);
    this.renderAnnotationInProgress = this.renderAnnotationInProgress.bind(this);
    this.renderAnnotations = this.renderAnnotations.bind(this);
    this.renderPreviousAnnotations = this.renderPreviousAnnotations.bind(this);
    this.renderUserAnnotations = this.renderUserAnnotations.bind(this);
    this.determineGreenLine = this.determineGreenLine.bind(this);

    this.state = {
      hoverObj: TRANSCRIBED_LINE,
    };
  }

  //----------------------------------------------------------------

  render() {
    const pendingLine = this.props.mouseInViewer && this.props.annotationInProgress !== null;
    const imageOffset = `translate(${-this.props.imageSize.width / 2}, ${-this.props.imageSize.height / 2})`;
    return (
      <g transform={imageOffset}>
        {pendingLine && (
          <PendingAnnotation
            annotationInProgress={this.props.annotationInProgress}
            getPointerXY={this.props.getPointerXY}
            mouseInViewer={this.props.mouseInViewer}
          />
        )}
        {this.props.shownMarks === MARKS_STATE.ALL && (
          this.renderPreviousAnnotations()
        )}

        {this.props.shownMarks !== MARKS_STATE.NONE && (
          this.renderUserAnnotations()
        )}

        {this.renderAnnotationInProgress()}

        <g ref={(el) => { this.tooltip = el; }} className="tooltip" >
          <defs>
            <filter id="shadow" height="180%">
              <feDropShadow dy="4" stdDeviation="4" floodColor="#4a4a4a" />
            </filter>
          </defs>

          <rect x="25" y="-30" width={this.state.hoverObj.width} height="45" fill="#979797" filter="url(#shadow)" />
          <polygon points="10,-6 25,-12 25,0" fill="#979797" />
          <text x="43" fill="#fff" fontFamily="Playfair Display">
            {this.state.hoverObj.text}
          </text>
        </g>

      </g>
    );
  }

  /*  Renders the annotation that the user is currently making, if there is one.
   */
  renderAnnotationInProgress() {
    if (!this.props.annotationInProgress) return null;

    const svgLinePrefix = 'ANNOTATION_IN_PROGRESS_LINE_';
    const svgPointPrefix = 'ANNOTATION_IN_PROGRESS_POINT_';
    const svgLines = [];
    const svgPoints = [];

    for (let i = 0; i < this.props.annotationInProgress.points.length; i++) {
      const point = this.props.annotationInProgress.points[i];

      svgPoints.push(
        <circle
          key={svgPointPrefix + i}
          cx={point.x} cy={point.y} r={10} fill="#00CED1"
        />,
      );

      if (i > 0) {
        const prevPoint = this.props.annotationInProgress.points[i - 1];
        svgLines.push(
          <line
            key={svgLinePrefix + (i - 1)}
            x1={prevPoint.x} y1={prevPoint.y}
            x2={point.x} y2={point.y}
            stroke="#00CED1" strokeWidth="2"
          />,
        );
      }
    }

    return (
      <g className="annotation-in-progress">
        <animate
          xlinkHref="#pulsating"
          attributeType="CSS" attributeName="opacity"
          from="1" to="0.2" dur="1s"
          begin="pulsating.mouseout"
          end="pulsating.mouseover"
          repeatCount="indefinite"
          fill="freeze"
        />
        {svgLines}
        {svgPoints}
      </g>
    );
  }

  /*  Renders all the annotations that the user has completed.
      WARNING: Not to be confused with annotations from other users!
   */
  renderUserAnnotations() {
    if (!this.props.annotations) return null;
    return this.renderAnnotations(this.props.annotations);
  }

  renderPreviousAnnotations() {
    if (this.props.subjectId === this.props.previousAnnotationSubjectId) {
      return this.renderAnnotations(this.props.previousAnnotations, true);
    }
  }

  determineGreenLine(annotation, index) {
    let greenLine = false;

    if (this.props.selectedAnnotation && index === this.props.selectedAnnotationIndex) {
      if (annotation.previousAnnotation && this.props.selectedAnnotation.previousAnnotation) {
        greenLine = true;
      } else if (!annotation.previousAnnotation && !this.props.selectedAnnotation.previousAnnotation) {
        greenLine = true;
      }
    }
    return greenLine;
  }

  renderAnnotations(annotations, previousAnnotations = false) {
    if (!annotations) return null;

    const annotationPrefix = 'ANNOTATION_';

    if (previousAnnotations && this.props.variant === VARIANT_TYPES.INDIVIDUAL) {
      annotations = annotations.filter((annotation) => {
        return annotation.consensusReached;
      });
    }

    return annotations.map((annotation, index) => {
      if (annotation.hasCollaborated === true) { return null; }
      if (annotation.frame !== this.props.frame) return null;

      let onSelectAnnotation = this.props.onSelectAnnotation;
      let hoverObj = TRANSCRIBED_LINE;
      let fillColor = previousAnnotations ? '#c33' : '#00CED1';
      const style = { cursor: 'pointer' };

      const selectedAnnotation = this.determineGreenLine(annotation, index);

      if (selectedAnnotation) { fillColor = '#5cb85c'; }
      if (previousAnnotations && annotation.consensusReached) {
        hoverObj = CONSENSUS_LINE;
        onSelectAnnotation = () => {};
        fillColor = '#979797';
        style.cursor = 'inherit';
      }

      let svgLinePrefix = `ANNOTATION_${index}_LINE_`;
      let svgPointPrefix = `ANNOTATION_${index}_POINT_`;
      if (previousAnnotations) {
        svgLinePrefix = `PREVIOUS_${svgLinePrefix}`;
        svgPointPrefix = `PREVIOUS_${svgPointPrefix}`;
      }
      const svgLines = [];
      const svgPoints = [];

      for (let i = 0; i < annotation.points.length; i++) {
        const point = annotation.points[i];

        svgPoints.push(
          <circle
            key={svgPointPrefix + i}
            cx={point.x} cy={point.y} r={10} fill={fillColor}
          />,
        );

        if (i > 0) {
          const prevPoint = annotation.points[i - 1];
          svgLines.push(
            <line
              key={svgLinePrefix + (i - 1)}
              x1={prevPoint.x} y1={prevPoint.y}
              x2={point.x} y2={point.y}
              stroke={fillColor} strokeWidth="2"
            />,
          );
        }
      }

      const renderedMarks = (
        <g
          className="annotation"
          key={annotationPrefix + index}
          style={style}
          onClick={(e) => {
            if (onSelectAnnotation) {
              onSelectAnnotation(index, previousAnnotations);
            }

            if (previousAnnotations) return;  //If retired line, don't stop events.
            return Utility.stopEvent(e);
          }}
          onMouseOver={(e) => {
            if (previousAnnotations) {
              this.setState({ hoverObj });
              this.tooltip.style.visibility = 'visible';
              return;  //If retired line, don't stop events.
            }
            return Utility.stopEvent(e);
          }}
          onMouseOut={(e) => {
            if (previousAnnotations) {
              this.tooltip.style.visibility = 'hidden';
              return;  //If retired line, don't stop events.
            }
            return Utility.stopEvent(e);
          }}
          onMouseMove={(e) => {
            if (previousAnnotations) {
              const cursor = this.props.getPointerXY(e);
              let rotationOffset;
              switch (this.props.rotation) {
                case 90:
                  rotationOffset = 270;
                  break;
                case 270:
                  rotationOffset = 90;
                  break;
                default:
                  rotationOffset = this.props.rotation;
              }
              this.tooltip.setAttribute('transform', `translate(${cursor.x}, ${cursor.y}) rotate(${rotationOffset})`);
              return;  //If retired line, don't stop events.
            }
            return Utility.stopEvent(e);
          }}
          onMouseDown={(e) => {  //Prevent triggering actions in the parent SubjectViewer.
            if (annotation.consensusReached) return;  //If retired line, don't stop events.
            return Utility.stopEvent(e);
          }}
          onMouseUp={(e) => {
            if (annotation.consensusReached) return;  //If retired line, don't stop events.
            return Utility.stopEvent(e);
          }}
        >
          {svgLines}
          {svgPoints}
        </g>
      );

      return renderedMarks;
    });
  }
}

AnnotationsPane.propTypes = {
  frame: PropTypes.number,
  onSelectAnnotation: PropTypes.func,
  //--------
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  //--------
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
    }),
  ),
  rotation: PropTypes.number,
  getPointerXY: PropTypes.func,
  mouseInViewer: PropTypes.bool,
  previousAnnotationSubjectId: PropTypes.string,
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  selectedAnnotation: PropTypes.shape({
    previousAnnotation: PropTypes.bool,
  }),
  selectedAnnotationIndex: PropTypes.number,
  shownMarks: PropTypes.number,
  subjectId: PropTypes.string,
  variant: PropTypes.string,
};

AnnotationsPane.defaultProps = {
  frame: 0,
  onSelectAnnotation: null,
  //--------
  imageSize: {
    width: 0,
    height: 0,
  },
  //--------
  annotationInProgress: null,
  annotations: [],
  rotation: 0,
  previousAnnotations: [],
  previousAnnotationSubjectId: null,
  selectedAnnotation: {
    previousAnnotation: false,
  },
  selectedAnnotationIndex: 0,
  shownMarks: 0,
  subjectId: null,
  variant: VARIANT_TYPES.INDIVIDUAL,
};

const mapStateToProps = (state) => {
  return {
    frame: state.subjectViewer.frame,
    rotation: state.subjectViewer.rotation,
    previousAnnotationSubjectId: state.previousAnnotations.subjectId,
    selectedAnnotation: state.annotations.selectedAnnotation,
    selectedAnnotationIndex: state.annotations.selectedAnnotationIndex,
    shownMarks: state.subjectViewer.shownMarks,
    subjectId: state.subject.id,
    variant: state.splits.variant,
  };
};

export default connect(mapStateToProps)(AnnotationsPane);
