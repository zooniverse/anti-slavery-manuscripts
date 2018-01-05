import React from 'react';
import PropTypes from 'prop-types';
import { Utility } from '../lib/Utility';

class PendingAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = {
      pointer: null
    }
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(e) {
    if (this.props.mouseInViewer && this.props.getPointerXY && this.props.annotationInProgress) {
      const pointer = this.props.getPointerXY(e);
      this.setState({ pointer });
    }
  }

  /*  Renders the annotation that the user is currently making, if there is one.
   */
  render() {
    if (!this.props.annotationInProgress) return null;
    let pendingPoint = null;
    let pendingLine = null;
    const i = this.props.annotationInProgress.points.length;

    const point = this.props.annotationInProgress.points[i];
    let fill = "#00CED1";

    if (this.state.pointer) {
      const prevPoint = this.props.annotationInProgress.points[i - 1];
      const beforePoint = this.props.annotationInProgress.points[i - 2];
      pendingPoint = (
        <circle
          key="PENDING_POINT"
          fillOpacity="0.4"
          cx={this.state.pointer.x} cy={this.state.pointer.y} r={10} fill={fill}
        />
      )
      pendingLine = (
        <line
          key="PENDING_LINE"
          fillOpacity="0.4"
          x1={prevPoint.x} y1={prevPoint.y}
          x2={this.state.pointer.x} y2={this.state.pointer.y}
          stroke={fill} strokeWidth="2"
        />
      )
    }

    return (
      <g className="annotation-in-progress" pointerEvents="none">
        {pendingPoint}
        {pendingLine}
      </g>
    );
  }
}

PendingAnnotation.propTypes = {
  annotationInProgress: PropTypes.shape({
    text: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  }),
  getPointerXY: PropTypes.func,
  mouseInViewer: PropTypes.bool,
};

PendingAnnotation.defaultProps = {
  annotationInProgress: null,
  getPointerXY: () => {},
  mouseInViewer: false,
};

export default PendingAnnotation;
