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

class AnnotationsPane extends React.Component {
  constructor(props) {
    super(props);
    this.renderAnnotationInProgress = this.renderAnnotationInProgress.bind(this);
    this.renderAnnotations = this.renderAnnotations.bind(this);
    this.renderPreviousAnnotations = this.renderPreviousAnnotations.bind(this);
  }

  //----------------------------------------------------------------

  render() {
    const imageOffset = `translate(${-this.props.imageSize.width/2}, ${-this.props.imageSize.height/2})`;
    return (
      <g transform={imageOffset}>
        {this.renderAnnotationInProgress()}
        {this.renderAnnotations()}
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
            cx={point.x} cy={point.y} r={10} fill="#c33"
            className="end"
            style={{cursor: 'pointer'}}
            onClick={(e) => {
              if (this.props.onCompleteAnnotation) {
                this.props.onCompleteAnnotation(point);
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
            cx={point.x} cy={point.y} r={10} fill="#5cb85c"
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
            stroke="#39c" strokeWidth="2"
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
  renderAnnotations() {
    if (!this.props.annotations) return null;
    if (!this.props.showPreviousMarks) return null;

    const annotationPrefix = 'ANNOTATION_';

    return this.props.annotations.map((annotation, indexOfAnnotation) => {
      if (annotation.frame !== this.props.frame) return null;
      const svgLinePrefix = `ANNOTATION_${indexOfAnnotation}_LINE_`;
      const svgPointPrefix = `ANNOTATION_${indexOfAnnotation}_POINT_`;
      const svgLines = [];
      const svgPoints = [];

      for (let i = 0; i < annotation.points.length; i++) {
        const point = annotation.points[i];

        svgPoints.push(
          <circle
            key={svgPointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill="#5cb85c"
          />
        );

        if (i > 0) {
          const prevPoint = annotation.points[i-1];
          svgLines.push(
            <line
              key={svgLinePrefix+(i-1)}
              x1={prevPoint.x} y1={prevPoint.y}
              x2={point.x} y2={point.y}
              stroke="#39c" strokeWidth="2"
            />
          );
        }
      }

      return (
        <g
          className="annotation"
          key={annotationPrefix + indexOfAnnotation}
          style={{cursor: 'pointer'}}
          onClick={(e) => {
            if (this.props.onSelectAnnotation) {
              this.props.onSelectAnnotation(indexOfAnnotation);
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
    });
  }

  renderPreviousAnnotations() {
    const previousAnnotations = this.props.previousAnnotations || [];

    return previousAnnotations.map((reduction) => {
      const annotationData = [];
      const currentAnnotations = reduction.data[`frame${this.props.frame}`];

      if (currentAnnotations) {
        currentAnnotations.clusters_text.map((text, i) => {
          const data = {
            points: [{
              x: currentAnnotations.clusters_x[i],
              y: currentAnnotations.clusters_y[i],
            }],
            text: '',
            textOptions: currentAnnotations.clusters_text[i]
          };

          data.svg =
            <circle
              key={`point${i}`}
              cx={data.points[0].x} cy={data.points[0].y} r={5} fill="#c33"
            />

          annotationData.push(data)
        });
      }

      return annotationData.map((point) => {
        return this.renderCircle(point);
      })
    })
  }

  renderCircle(data) {
    return (
      <g
        onClick={(e) => {
          if (this.props.onSelectPreviousAnnotation) {
            this.props.onSelectPreviousAnnotation(data);
          }
          return Utility.stopEvent(e);
        }}
        onMouseDown={(e) => {
          return Utility.stopEvent(e);
        }}
        onMouseUp={(e) => {
          return Utility.stopEvent(e);
        }}
      >
        {data.svg}
      </g>
    )
  }
}

AnnotationsPane.propTypes = {
  frame: PropTypes.number,
  onCompleteAnnotation: PropTypes.func,
  onSelectAnnotation: PropTypes.func,
  onSelectPreviousAnnotation: PropTypes.func,
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
    })
  ),
  frame: PropTypes.number,
  previousAnnotations: PropTypes.arrayOf(PropTypes.object),
  showPreviousMarks: PropTypes.bool,
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
  annotationInProgress: null,
  annotations: [],
  previousAnnotations: [],
  showPreviousMarks: true,
};

const mapStateToProps = (state) => {
  return {
    frame: state.subjectViewer.frame,
  };
};

export default connect(mapStateToProps)(AnnotationsPane);
