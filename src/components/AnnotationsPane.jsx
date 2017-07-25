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

export default class AnnotationsPane extends React.Component {
  constructor(props) {
    super(props);
    this.renderAnnotationInProgress = this.renderAnnotationInProgress.bind(this);
  }

  //----------------------------------------------------------------

  render() {
    const imageOffset = `translate(${-this.props.imageSize.width/2}, ${-this.props.imageSize.height/2})`;
    return (
      <g transform={imageOffset}>
        <g>
          {this.renderAnnotationInProgress()}
        </g>
      </g>
    );
  }
  
  renderAnnotationInProgress() {
    if (!this.props.annotationInProgress) return null;
    
    const linePrefix = 'ANNOTATION_IN_PROGRESS_LINE_';
    const pointPrefix = 'ANNOTATION_IN_PROGRESS_POINT_';
    const lines = [];
    const points = [];
    
    for (let i = 0; i < this.props.annotationInProgress.points.length; i++) {
      const point = this.props.annotationInProgress.points[i];
      
      if (i === this.props.annotationInProgress.points.length-1) {  //Final node: click to finish annotation.
        points.push(
          <circle
            key={pointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill="#c33"
            className="end"
            style={{cursor: 'pointer'}}
            onMouseUp={this.props.onCompleteAnnotation}
          />
        );  
      } else {
        points.push(
          <circle
            key={pointPrefix+i}
            cx={point.x} cy={point.y} r={10} fill="#3cf"
          />
        );
      }
      
      if (i > 0) {
        const prevPoint = this.props.annotationInProgress.points[i-1];
        lines.push(
          <line
            key={linePrefix+(i-1)}
            x1={prevPoint.x} y1={prevPoint.y}
            x2={point.x} y2={point.y}
            stroke="#39c" strokeWidth="2"
          />
        );
      }
    }
    
    return (
      <g className="annotation-in-progress">
        {lines}
        {points}
      </g>
    );
  }
}

AnnotationsPane.propTypes = {
  onCompleteAnnotation: PropTypes.func,
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
};

AnnotationsPane.defaultProps = {
  onCompleteAnnotation: null,
  //--------
  imageSize: {
    width: 0,
    height: 0,
  },
  //--------
  annotationInProgress: null,
  annotations: [],
};
