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
        {this.renderAnnotationInProgress()}
      </g>
    );
  }
  
  renderAnnotationInProgress() {
    if (!this.props.annotationInProgress) return null;
    
    const keyPrefix = 'ANNOTATION_IN_PROGRESS_';
    const line = [];
    
    for (let i = 0; i < this.props.annotationInProgress.points.length; i++) {
      const point = this.props.annotationInProgress.points[i];
      
      line.push(<circle key={keyPrefix+i} cx={point.x} cy={point.y} fill="#3cf" r={10} />);
      
      if (i > 0) {
        const prevPoint = this.props.annotationInProgress.points[i-1];
        line.push(<line x1={prevPoint.x} y1={prevPoint.y} x2={point.x} y2={point.y} stroke="#39c" strokeWidth="2" />);
        
      }
    }
    
    return <g className="annotation-in-progress">{line}</g>;
  }
}

AnnotationsPane.propTypes = {
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
  imageSize: {
    width: 0,
    height: 0,
  },
  //--------
  annotationInProgress: null,
  annotations: [],
};
