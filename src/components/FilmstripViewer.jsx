import React from 'react';
import PropTypes from 'prop-types';
import SVGImage from './SVGImage';
import { connect } from 'react-redux';
import { getAllLocations } from '../lib/get-subject-location';
import { changeFrame } from '../ducks/subject-viewer';

class FilmstripViewer extends React.Component {
  constructor(props) {
    super(props);

    this.renderFrames = this.renderFrames.bind(this);
  }

  changeFrame(i) {
    this.props.dispatch(changeFrame(i))
  }

  renderFrames() {
    const SVG_WIDTH = 40;
    const SVG_HEIGHT = 60;
    let scale = 0.1;
    let images = [];
    const viewBox = `-${(SVG_WIDTH / scale) / 2} -${(SVG_HEIGHT / scale) / 2} ${SVG_WIDTH / scale} ${SVG_HEIGHT / scale}`;
    if (this.props.currentSubject) {
      images = getAllLocations(this.props.currentSubject);
    }
    const render = images.map((image, i) => {
      return (
        <div className="related-images__frame">
          <button onClick={this.changeFrame.bind(this, i)}>
            <svg
              style={{ width: `${SVG_WIDTH}px`, height: `${SVG_HEIGHT}px` }}
              ref={(c) => { this.svg = c; }}
              viewBox={viewBox}
            >
              <g>
                <SVGImage
                  ref={(c) => { this.svgImage = c; }}
                  src={image.src}
                />
              </g>
            </svg>
            <div>
              <span> {i + 1} / {images.length}</span>
            </div>
          </button>
        </div>
      )
    })
    return (
      <div className="related-images__frames">
        {render}
      </div>
    )
  }

  render() {
    return (
      <div className="related-images">
        <div>
          <h2>Related Images</h2>
        </div>

        {this.renderFrames()}

      </div>
    )
  }
}

FilmstripViewer.propTypes = {
  currentSubject: PropTypes.shape({
    src: PropTypes.string,
  }),
  dispatch: PropTypes.func,
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

FilmstripViewer.defaultProps = {
  imageSize: {
    height: 0,
    width: 0,
  }
};

const mapStateToProps = (state, ownProps) => {
  const sv = state.subjectViewer;
  return {
    currentSubject: state.subject.currentSubject,
    frame: sv.frame,
    imageSize: sv.imageSize,
  }
}

export default connect(mapStateToProps)(FilmstripViewer);
