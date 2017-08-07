import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SVGImage from '../components/SVGImage';
import { Utility } from '../lib/Utility';

import {
  setScaling, setTranslation,
  setViewerState, updateViewerSize, updateImageSize,
  SUBJECTVIEWER_STATE,
} from '../ducks/subject-viewer';
import getSubjectLocation from '../lib/get-subject-location';

class Navigator extends React.Component {
  constructor(props) {
    super(props);

    //HTML element refs.
    this.section = null;
    this.svg = null;
    this.svgImage = null;

    //Other functions
    this.getBoundingBox = this.getBoundingBox.bind(this);
    this.getPointerXY = this.getPointerXY.bind(this);

  }
  //----------------------------------------------------------------

  componentDidMount() {
    this.svg.addEventListener('click', this.getPointerXY);
  }

  componentWillUnmount() {
    this.svg.addEventListener('click', this.getPointerXY);
  }

  getPointerXY(e) {
    const ZOOM_STEP = 0.1;
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

    this.tmpTransform = {
      scale: this.props.scaling,
      translateX: this.props.translationX,
      translateY: this.props.translationY,
    };

    console.log(this.tmpTransform.translateX + inputX / this.tmpTransform.scale);

    this.props.dispatch(setTranslation(
      this.tmpTransform.translateX + inputX * this.tmpTransform.scale,
      this.tmpTransform.translateY + inputY * this.tmpTransform.scale,
    ));
    // return { x: inputX, y: inputY };
    this.props.dispatch(setScaling(this.props.scaling + ZOOM_STEP));
  }

  render() {
    const SVG_WIDTH = 150;
    const SVG_HEIGHT = 150;
    let scale = 0.1;
    if (this.props.imageSize.width !== 0 && this.props.imageSize.height !== 0) {
      scale = Math.min(SVG_WIDTH / this.props.imageSize.width, SVG_HEIGHT / this.props.imageSize.height);
    }
    const viewBox = `-${(SVG_WIDTH / scale) / 2} -${(SVG_HEIGHT / scale) / 2} ${SVG_WIDTH / scale} ${SVG_HEIGHT / scale}`;
    const transform = `translate(${this.props.translationX * this.props.scaling}, ${this.props.translationY * this.props.scaling}) rotate(${this.props.rotation})`;
    let subjectLocation;
    if (this.props.currentSubject) subjectLocation = getSubjectLocation(this.props.currentSubject).src;

    return (
      <section className="navigator-viewer" ref={(c) => { this.section = c; }}>
        <svg
          style={{ width: `${SVG_WIDTH}px`, height: `${SVG_HEIGHT}px` }}
          ref={(c) => { this.svg = c; }}
          viewBox={viewBox}
        >
          <g transform={transform}>
            {subjectLocation && (
              <SVGImage
                ref={(c) => { this.svgImage = c; }}
                src={subjectLocation}
              />
            )}
          </g>
          <g>
            <rect
              x={this.props.viewerSize.width / -2 / this.props.scaling}
              y={this.props.viewerSize.height / -2 / this.props.scaling}
              width={this.props.viewerSize.width / this.props.scaling}
              height={this.props.viewerSize.height / this.props.scaling}
              fill="none" stroke="red" strokeWidth="8px"
            />
          </g>
        </svg>
      </section>
    );
  }

  getBoundingBox() {
    const boundingBox = (this.svg && this.svg.getBoundingClientRect)
      ? this.svg.getBoundingClientRect()
      : { left: 0, top: 0, width: 1, height: 1 };
    return boundingBox;
  }
}

Navigator.propTypes = {
  currentSubject: PropTypes.shape({
    src: PropTypes.string,
  }),
  imageSize: {
    width: PropTypes.number,
    height: PropTypes.number,
  },
  dispatch: PropTypes.func,
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,
  viewerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};
Navigator.defaultProps = {
  imageSize: {
    width: 0,
    height: 0,
  },
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
  viewerSize: {
    width: 0,
    height: 0,
  },
};
const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  const store = state.subjectViewer;
  return {
    currentSubject: state.subject.currentSubject,
    rotation: store.rotation,
    scaling: store.scaling,
    translationX: store.translationX,
    translationY: store.translationY,
    viewerSize: store.viewerSize,
    imageSize: store.imageSize,
  };
};
export default connect(mapStateToProps)(Navigator);  //Connects the Component to the Redux Store
