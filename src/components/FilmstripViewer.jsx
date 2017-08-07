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
    this.scroll = this.scroll.bind(this);
  }

  changeFrame(i) {
    this.props.dispatch(changeFrame(i))
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

  renderFrames() {
    const SVG_WIDTH = 40;
    const SVG_HEIGHT = 60;
    let scale = 0.08;
    const viewBox = `-${(SVG_WIDTH / scale) / 2} -${(SVG_HEIGHT / scale) / 2} ${SVG_WIDTH / scale} ${SVG_HEIGHT / scale}`;
    if (!this.props.currentSubject) { return }
    const images = getAllLocations(this.props.currentSubject);

    const render = images.map((image, i) => {
      const activeBorder = i === this.props.frame ? "related-images__frame--active" : ""

      return (
        <div key={i} className={`related-images__frame ${activeBorder}`} ref={(el) => {this.strip = el; }}>
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
    const renderButtons = this.props.currentSubject && this.props.currentSubject.locations.length > 5 ? true : false;
    return (
      <section className="filmstrip-viewer" style={{height: this.props.viewerSize.height}}>
        {renderButtons && (
          <button className="related-images__top" onClick={this.scroll.bind(this, false)}><i className="fa fa-chevron-up" /></button>
        )}
        <div className="related-images" ref={(el) => {this.viewport = el; }} style={{height: this.props.viewerSize.height}}>
          <div>
            <h2>Related Images</h2>
          </div>

          {this.renderFrames()}

        </div>
        {renderButtons && (
          <button className="related-images__down" onClick={this.scroll.bind(this, true)}><i className="fa fa-chevron-down" /></button>
        )}
      </section>
    )
  }
}

FilmstripViewer.propTypes = {
  currentSubject: PropTypes.shape({
    locations: PropTypes.array,
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
    viewerSize: sv.viewerSize
  }
}

export default connect(mapStateToProps)(FilmstripViewer);
