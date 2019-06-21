import React from 'react';
import PropTypes from 'prop-types';

const MAX_THUMBNAIL_DIMENSION = 999;

export default class Thumbnail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      failed: false,
    };

    this.handleError = this.handleError.bind(this);
  }

  getThumbnailSrc({ origin, width, height, src }) {
    let srcPath = src.split('//').pop();
    srcPath = srcPath.replace('static.zooniverse.org/', '');
    return (`${origin}/${width}x${height}/${srcPath}`);
  }

  handleError() {
    if (!this.state.failed) {
      this.setState({ failed: true });
    }
  }

  render() {
    const src = this.state.failed ? this.props.src : this.getThumbnailSrc(this.props);

    const style = {
      maxWidth: this.props.width,
      maxHeight: this.props.height,
    };

    return (
      <img
        {...this.props}
        alt="Field Guide Thumbnail"
        src={src}
        style={style}
        onError={this.handleError}
      />
    );
  }
}

Thumbnail.defaultProps = {
  height: MAX_THUMBNAIL_DIMENSION,
  origin: 'https://thumbnails.zooniverse.org',
  src: '',
  width: MAX_THUMBNAIL_DIMENSION,
};

Thumbnail.propTypes = {
  height: PropTypes.number,
  origin: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.number,
};
