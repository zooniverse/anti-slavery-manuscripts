import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LineAnnotation from '../images/LineAnnotation.png';
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
          To create a new transcription, click below the start of a line of text
          just before the first word, and again just after the last word.
          This will underline the text you wish to transcribe.
        </span>

        <span>
          Please transcibe and transcribe entire lines at a time. Words split
          between two lines should be typed out in their entirety on the first line.
          If you&apos;re unsure of anything, please revisit the project tutorial.
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
