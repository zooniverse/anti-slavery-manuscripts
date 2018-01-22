import React from 'react';
import PropTypes from 'prop-types';
import SVGImage from './SVGImage';
import { connect } from 'react-redux';
import { getAllLocations } from '../lib/get-subject-location';
import { changeFrame } from '../ducks/subject-viewer';
import { changeFrameData } from '../ducks/previousAnnotations';

const THUMB_WIDTH = 40;
const THUMB_HEIGHT = 60;

class FilmstripViewer extends React.Component {
  constructor(props) {
    super(props);

    this.renderFrames = this.renderFrames.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  changeFrame(i) {
    this.props.dispatch(changeFrame(i));
    this.props.dispatch(changeFrameData(i));
  }

  scroll(scrollDown = true) {
    let i = 0;

    const scroll = () => {
      scrollDown ? this.viewport.scrollTop += 20 : this.viewport.scrollTop -= 20
      i += 1;

      if (i < 10) { setTimeout(scroll, 20); }
    }
    scroll();
  }

  thumbnailPath(src) {
    const thumbSize = `${THUMB_WIDTH}x${THUMB_HEIGHT}/`;
    const thumbHost = 'https://thumbnails.zooniverse.org/';
    const protomatch = /^(https?|ftp):\/\//;
    const subjectLoc = src.replace(protomatch, '');
    return thumbHost + thumbSize + subjectLoc;
  }

  renderFrames() {
    if (!this.props.currentSubject) { return }
    const images = getAllLocations(this.props.currentSubject);

    const render = images.map((image, i) => {
      const activeBorder = i === this.props.frame ? 'related-images__frame--active' : '';
      const thumbnailSrc = this.thumbnailPath(image.src);

      return (
        <div key={i} className={`related-images__frame ${activeBorder}`} ref={(el) => {this.strip = el; }}>
          <button onClick={this.changeFrame.bind(this, i)}>
            <img alt={`Frame ${i + 1}`} src={thumbnailSrc} style={{ width: '100%', height: 'auto' }} />
            <div>
              <span> {i + 1} / {images.length}</span>
            </div>
          </button>
        </div>
      );
    });
    return (
      <div className="related-images__frames">
        {render}
      </div>
    );
  }

  render() {
    const MINIMUM_IMAGES_FOR_SCROLL_BUTTONS = 5;
    const renderButtons = this.props.currentSubject && this.props.currentSubject.locations.length > MINIMUM_IMAGES_FOR_SCROLL_BUTTONS;
    let filmstripHeight = this.props.viewerSize.height;

    if (this.props.currentSubject && this.props.currentSubject.already_seen) {
      filmstripHeight += 30;
    }

    return (
      <section className="filmstrip-viewer" id="filmstrip-column" style={{ height: filmstripHeight }}>
        {renderButtons && (
          <button className="related-images__top" onClick={this.scroll.bind(this, false)}><i className="fa fa-chevron-up" /></button>
        )}
        <div className="related-images" ref={(el) => {this.viewport = el; }} style={{ height: filmstripHeight }}>
          <div>
            <h2>Other Pages</h2>
          </div>

          {this.renderFrames()}

        </div>
        {renderButtons && (
          <button className="related-images__down" onClick={this.scroll.bind(this, true)}><i className="fa fa-chevron-down" /></button>
        )}
      </section>
    );
  }
}

FilmstripViewer.propTypes = {
  currentSubject: PropTypes.shape({
    already_seen: PropTypes.bool,
    locations: PropTypes.array,
    src: PropTypes.string,
  }),
  dispatch: PropTypes.func,
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  viewerSize: PropTypes.shape({
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
    viewerSize: sv.viewerSize
  }
}

export default connect(mapStateToProps)(FilmstripViewer);
