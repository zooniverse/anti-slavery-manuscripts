import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { connect } from 'react-redux';
import { getSubjectLocation } from '../lib/get-subject-location';

const ENABLE_DRAG = 'handle save-snippet';
const DISABLE_DRAG = 'save-snippet';

class SaveClip extends React.Component {
  constructor(props) {
    super(props);

    this.cropUrl = this.cropUrl.bind(this);
    this.saveClip = this.saveClip.bind(this);
  }

  componentDidMount() {
    this.inputText.addEventListener('mousedown', () => {
      this.dialog.className = DISABLE_DRAG;
    });
    this.inputText.addEventListener('mouseup', () => {
      this.dialog.className = ENABLE_DRAG;
    });
  }

  componentWillUnmount() {
    this.inputText.removeEventListener('mousedown', () => {
      this.dialog.className = DISABLE_DRAG;
    });
    this.inputText.removeEventListener('mouseup', () => {
      this.dialog.className = ENABLE_DRAG;
    });
  }

  cropUrl() {
    if (!this.props.points) return null;
    const { width, height, x, y } = this.props.points;
    const imageSrc = getSubjectLocation(this.props.subject, this.props.frame).src;
    const url = imageSrc.replace(/^https?\:\/\//i, '');
    return `https://imgproc.zooniverse.org/crop/?w=${width}&h=${height}&x=${x}&y=${y}&u=${url}`;
  }

  saveClip(e) {
    let query;
    const prefs = this.props.preferences;
    const clip = {
      cropUrl: this.cropUrl(),
      height: this.props.points.height,
      name: this.inputText.value,
      original: {
        location: this.props.subject.locations[this.props.frame],
        subject_id: this.props.subjectID,
      },
      width: this.props.points.width,
      x: this.props.points.x,
      y: this.props.points.y,
    };

    if (prefs) {
      if (!prefs.preferences.cribsheet) {
        query = [clip];
      } else {
        const copied = prefs.preferences.cribsheet.slice();
        copied.push(clip);
        query = copied;
      }
    }
    prefs.update({ 'preferences.cribsheet': query }).save();
    this.props.onClose && this.props.onClose(e);
  }

  render() {
    return (
      <div className={ENABLE_DRAG} ref={(c) => { this.dialog = c; }}>
        <h3>Save Snippet to Cribsheet</h3>
        <div className="save-snippet__image">
          <img role="presentation" src={this.cropUrl()} />
        </div>
        <input type="text" ref={(c) => { this.inputText = c; }} placeholder="Snippet Name" />

        <div className="save-snippet__buttons">
          <button onClick={this.props.onClose}>Cancel</button>
          <button onClick={this.saveClip}>Save</button>
        </div>

      </div>
    );
  }
}

SaveClip.defaultProps = {
  frame: 0,
  preferences: null,
  points: null,
  subject: null,
  subjectID: '',
};

SaveClip.propTypes = {
  frame: PropTypes.number,
  onClose: PropTypes.func,
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
  }),
  points: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  subject: PropTypes.shape({
    locations: PropTypes.array,
  }),
  subjectID: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    subject: state.subject.currentSubject,
    frame: state.subjectViewer.frame,
    preferences: state.project.userPreferences,
    subjectID: state.subject.id,
  };
};

export default connect(mapStateToProps)(SaveClip);
