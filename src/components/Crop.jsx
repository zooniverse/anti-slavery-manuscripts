import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDialog } from '../ducks/dialog';
import SaveClip from '../components/SaveClip';
import { setViewerState, SUBJECTVIEWER_STATE } from '../ducks/subject-viewer';

const MINIMUM_SIZE = 10;

class Crop extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.findPoints = this.findPoints.bind(this);
    this.cancelCrop = this.cancelCrop.bind(this);
    this.state = {
      rectangleNow: null,
    };
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    const points = this.findPoints();
    if (points.width > MINIMUM_SIZE && points.height > MINIMUM_SIZE) {
      this.props.dispatch(toggleDialog(<SaveClip points={points} />, false, true));
    }
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  cancelCrop() {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.ANNOTATING));
  }

  handleMouseMove(e) {
    if (this.props.mouseInViewer && this.props.getPointerXY) {
      const rectangleNow = this.props.getPointerXY(e);
      this.setState({ rectangleNow });
    }
  }

  findPoints() {
    const rectangleNow = this.state.rectangleNow || this.props.rectangleStart;
    return {
      x: Math.min(this.props.rectangleStart.x, rectangleNow.x),
      y: Math.min(this.props.rectangleStart.y, rectangleNow.y),
      width: Math.abs(this.props.rectangleStart.x - rectangleNow.x),
      height: Math.abs(this.props.rectangleStart.y - rectangleNow.y),
    };
  }

  render() {
    const points = this.findPoints();
    return (
      <g transform={`translate(${-this.props.imageSize.width / 2}, ${-this.props.imageSize.height / 2})`}>
        <rect
          x={points.x}
          y={points.y}
          width={points.width}
          height={points.height}
          style={{ fill: 'none', strokeWidth: '5', stroke: '#007482' }}
        />
      </g>
    );
  }
}

Crop.propTypes = {
  dispatch: PropTypes.func,
  getPointerXY: PropTypes.func,
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  mouseInViewer: PropTypes.bool,
  rectangleStart: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

Crop.defaultProps = {
  currentSubject: null,
  getPointerXY: () => {},
  imageSize: {
    width: 0,
    height: 0,
  },
  mouseInViewer: false,
  rectangleStart: { x: 0, y: 0 },
};

export default connect()(Crop);
