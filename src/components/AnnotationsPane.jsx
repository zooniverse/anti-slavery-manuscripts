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
import { Utility } from '../lib/Utility';
import { connect } from 'react-redux';
import { VisibilitySplit } from 'seven-ten';

class AnnotationsPane extends React.Component {
  constructor(props) {
    super(props);
    this.renderAnnotationInProgress = this.renderAnnotationInProgress.bind(this);
    this.renderAnnotations = this.renderAnnotations.bind(this);
    this.renderPreviousAnnotations = this.renderPreviousAnnotations.bind(this);
    this.renderUserAnnotations = this.renderUserAnnotations.bind(this);
    this.determineGreenLine = this.determineGreenLine.bind(this);
  }

  //----------------------------------------------------------------

  render() {
    const imageOffset = `translate(${-this.props.imageSize.width/2}, ${-this.props.imageSize.height/2})`;
    return (
      <g transform={imageOffset}>
        {this.renderAnnotationInProgress()}
        {this.renderUserAnnotations()}
        {this.renderPreviousAnnotations()}
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

      if (i === this.props.annotationInProgress.points.length-1) {  //Final node: click to finish annotation.
        svgPoints.push(
          <circle
            key={svgPointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill="#00CED1"
            className="end"
            style={{cursor: 'pointer'}}
            onClick={(e) => {
              if (this.props.onCompleteAnnotation) {
                this.props.onCompleteAnnotation();
              }
              return Utility.stopEvent(e);
            }}
            onMouseDown={(e) => {  //Prevent triggering actions in the parent SubjectViewer.
              return Utility.stopEvent(e);
            }}
            onMouseUp={(e) => {
              return Utility.stopEvent(e);
            }}
          />
        );
      } else {
        svgPoints.push(
          <circle
            key={svgPointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill="#00CED1"
          />
        );
      }

      if (i > 0) {
        const prevPoint = this.props.annotationInProgress.points[i-1];
        svgLines.push(
          <line
            key={svgLinePrefix+(i-1)}
            x1={prevPoint.x} y1={prevPoint.y}
            x2={point.x} y2={point.y}
            stroke="#00CED1" strokeWidth="2"
          />
        );
      }
    }

    return (
      <g className="annotation-in-progress">
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
    if (!this.props.previousAnnotations || !this.props.splits) return null;
    return this.renderAnnotations(this.props.previousAnnotations, true);
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
    if (!this.props.showPreviousMarks) return null;

    const annotationPrefix = 'ANNOTATION_';

    return annotations.map((annotation, index) => {
      if (annotation.hasCollaborated === true) { return null; }
      if (annotation.frame !== this.props.frame) return null;

      let onSelectAnnotation = this.props.onSelectAnnotation;
      let fillColor = previousAnnotations ? "#c33" : "#00CED1";
      let style = { cursor: 'pointer' };

      const selectedAnnotation = this.determineGreenLine(annotation, index);

      if (selectedAnnotation) { fillColor = "#5cb85c"; }
      if (previousAnnotations && annotation.consensusReached) {
        onSelectAnnotation = () => {};
        fillColor = "#979797";
        style.cursor = 'inherit';
      }

      let svgLinePrefix = `ANNOTATION_${index}_LINE_`;
      let svgPointPrefix = `ANNOTATION_${index}_POINT_`;
      if (previousAnnotations) {
        svgLinePrefix = `PREVIOUS_` + svgLinePrefix;
        svgPointPrefix = `PREVIOUS_` + svgPointPrefix;
      };
      const svgLines = [];
      const svgPoints = [];

      for (let i = 0; i < annotation.points.length; i++) {
        const point = annotation.points[i];

        svgPoints.push(
          <circle
            key={svgPointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill={fillColor}
          />
        );

        if (i > 0) {
          const prevPoint = annotation.points[i-1];
          svgLines.push(
            <line
              key={svgLinePrefix+(i-1)}
              x1={prevPoint.x} y1={prevPoint.y}
              x2={point.x} y2={point.y}
              stroke={fillColor} strokeWidth="2"
            />
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
            return Utility.stopEvent(e);
          }}
          onMouseDown={(e) => {  //Prevent triggering actions in the parent SubjectViewer.
            return Utility.stopEvent(e);
          }}
          onMouseUp={(e) => {
            return Utility.stopEvent(e);
          }}
        >
          {svgLines}
          {svgPoints}
        </g>
      );

      if (previousAnnotations && this.props.adminOverride) { return renderedMarks; }

      if (this.props.splits && previousAnnotations) {
        return (
          <VisibilitySplit key={annotationPrefix + index} splits={this.props.splits} splitKey={'classifier.collaborative'} elementKey={'div'}>
            {renderedMarks}
          </VisibilitySplit>
        )
      } else {
        return renderedMarks
      }
    });
  }
}

AnnotationsPane.propTypes = {
  frame: PropTypes.number,
  onCompleteAnnotation: PropTypes.func,
  onSelectAnnotation: PropTypes.func,
  //--------
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  //--------
  adminOverride: PropTypes.bool,
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
  frame: PropTypes.number,
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  selectedAnnotation: PropTypes.shape({
    previousAnnotation: PropTypes.bool
  }),
  selectedAnnotationIndex: PropTypes.number,
  showPreviousMarks: PropTypes.bool,
  splits: PropTypes.object
};

AnnotationsPane.defaultProps = {
  frame: 0,
  onCompleteAnnotation: null,
  onSelectAnnotation: null,
  frame: 0,
  //--------
  imageSize: {
    width: 0,
    height: 0,
  },
  //--------
  adminOverride: false,
  annotationInProgress: null,
  annotations: [],
  previousAnnotations: [],
  selectedAnnotation: {
    previousAnnotation: false
  },
  selectedAnnotationIndex: 0,
  showPreviousMarks: true,
  splits: null
};

const mapStateToProps = (state) => {
  return {
    adminOverride: state.splits.adminOverride,
    frame: state.subjectViewer.frame,
    selectedAnnotation: state.annotations.selectedAnnotation,
    selectedAnnotationIndex: state.annotations.selectedAnnotationIndex,
    splits: state.splits.data
  };
};

export default connect(mapStateToProps)(AnnotationsPane);
