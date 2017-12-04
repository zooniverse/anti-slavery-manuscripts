import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LineAnnotation from '../images/LineAnnotation.gif';
import { reminderSeen } from '../ducks/project';

class AnnotationReminder extends React.Component {
  componentWillUnmount() {
    this.props.dispatch(reminderSeen());

    if (this.props.user) {
      const prefs = this.props.userPreferences;
      if (!prefs.preferences) {
        prefs.preferences = {};
      }
      if (!prefs.preferences.annotation_reminder) {
        prefs.preferences.annotation_reminder = {};
      }
      const changes = {};
      changes[`preferences.annotation_reminder.${this.props.projectId}`] = true;
      prefs.update(changes);
      prefs.save();
    }
  }

  render() {
    return (
      <div className="annotation-reminder__content">
        <img role="presentation" src={LineAnnotation} />
        <span>
          To create a new transcription, click below the start of the line of text
          just before the first word, then place one dot in each space between words.
        </span>
        <span>
          When you reach the end of the line, place a dot under the space just after the final word.
        </span>
        <span>
          Click the last dot again to open the transcription box.
        </span>
        <span>
          Check out the tutorial to learn more.
        </span>
      </div>
    );
  }
}

AnnotationReminder.propTypes = {
  dispatch: PropTypes.func,
  projectId: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  userPreferences: PropTypes.shape({
    preferences: PropTypes.object,
  }),
};

const mapStateToProps = (state) => {
  return {
    projectId: state.project.id,
    user: state.login.user,
    userPreferences: state.project.userPreferences,
  };
};

export default connect(mapStateToProps)(AnnotationReminder);
