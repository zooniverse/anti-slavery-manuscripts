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

class Navigator extends React.Component {
  constructor(props) {
    super(props);

    //HTML element refs.
    this.section = null;
    this.svg = null;
    this.svgImage = null;

    //Other functions
    this.getBoundingBox = this.getBoundingBox.bind(this);

  }
  //----------------------------------------------------------------

  render() {
    const SVG_WIDTH = 200;
    const SVG_HEIGHT = 200;
    let scale = 0.1;
    if (this.props.imageSize.width !== 0 && this.props.imageSize.height !== 0) {
      scale = Math.min(SVG_WIDTH / this.props.imageSize.width, SVG_HEIGHT / this.props.imageSize.height);
    }
    let viewBox = `-${(SVG_WIDTH / scale) / 2} -${(SVG_HEIGHT / scale) / 2} ${SVG_WIDTH / scale} ${SVG_HEIGHT / scale}`;

    return (
      <section className="navigator-viewer" ref={(c) => { this.section = c; }}>
        <svg
          style={{ width: `${SVG_WIDTH}px`, height: `${SVG_HEIGHT}px` }}
          ref={(c) => { this.svg = c; }}
          viewBox={viewBox}
        >
          <g>
            <SVGImage
              ref={(c) => { this.svgImage = c; }}
              src="https://panoptes-uploads.zooniverse.org/production/subject_location/97af440c-15d2-4fb1-bc18-167c9151050a.jpeg"
            />
            <circle cx="0" cy="0" r="20" fill="red" />
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
    rotation: store.rotation,
    scaling: store.scaling,
    translationX: store.translationX,
    translationY: store.translationY,
    viewerSize: store.viewerSize,
    imageSize: store.imageSize,
  };
};
export default connect(mapStateToProps)(Navigator);  //Connects the Component to the Redux Store
