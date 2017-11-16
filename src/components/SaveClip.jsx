import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { getSubjectLocation } from '../lib/get-subject-location';
import { connect } from 'react-redux';

class SaveClip extends React.Component {
  constructor(props) {
    super(props);

    this.constructData = this.constructData.bind(this);
    this.cropUrl = this.cropUrl.bind(this);
    this.saveClip = this.saveClip.bind(this);
  }



  constructData() {
    const clip = {
      cropUrl: this.cropUrl,
      height: this.props.points.height,
      name: '',
      original: {
        location: this.props.subject.locations[this.props.frame],
        subject_id: this.props.subjectID
      },
      width: this.props.points.width,
      x: this.props.points.x,
      y: this.props.points.y
    };
  }

  cropUrl() {
    if (!this.props.points) return null;
    let {width, height, x, y} = this.props.points;
    const imageSrc = getSubjectLocation(this.props.subject, this.props.frame).src;
    const url = imageSrc.replace(/^https?\:\/\//i, '');
    return `https://imgproc.zooniverse.org/crop/?w=${width}&h=${height}&x=${x}&y=${y}&u=${url}`;
  }

  saveClip() {
    console.log(this.cropUrl());
  }

  render() {
    return (
      <div className="save-snippet">
        <h3>Save Snippet to Cribsheet</h3>
        <img src={this.cropUrl()} />
        <input type="text" placeholder="Snippet Name" />
        <button onClick={this.saveClip}>Save</button>
        <button onClick={this.props.onClose} >Cancel</button>
      </div>
    )
  }
}

SaveClip.defaultProps = {
  frame: 0,
  points: null,
  subject: null,
  subjectID: ''
};

SaveClip.propTypes = {
  frame: PropTypes.number,
  points: PropTypes.object,
  subject: PropTypes.object,
  subjectID: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    subject: state.subject.currentSubject,
    frame: state.subjectViewer.frame,
    subjectID: state.subject.id
  };
};

export default connect(mapStateToProps)(SaveClip);
