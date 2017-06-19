/*
Classifier Tester
-----------------

This component is used to test our ability to connect to the Panoptes API
service, without having to worry about the presentational side of things.

 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProject, PROJECT_STATUS } from '../ducks/project';
import { fetchSubject, SUBJECT_STATUS } from '../ducks/subject';

class ClassifierTester extends React.Component {
  constructor(props) {
    super(props);
    this.fetchProject = this.fetchProject.bind(this);
    this.fetchSubject = this.fetchSubject.bind(this);
  }

  render() {
    return (
      <main className="app-content tester-page">
        <div className="control-panel">
          <button className="green button" onClick={this.fetchProject}>Fetch Project</button>
          <button className="green button" onClick={this.fetchSubject}>Fetch Subject</button>
        </div>
        <div className="status-panel">
          {this.printProjectStatus()}
        </div>
        <div className="status-panel">
          {this.printSubjectStatus()}
        </div>
        {this.printProjectData()}
        {this.printSubjectData()}
      </main>
    );
  }

  printProjectStatus() {
    switch (this.props.projectStatus) {
      case PROJECT_STATUS.IDLE:
        return 'Press that button!';
      case PROJECT_STATUS.FETCHING:
        return 'Give me a second...';
      case PROJECT_STATUS.READY:
        return 'Here\'s your project:';
      case PROJECT_STATUS.ERROR:
        return 'WHOOPS, something went wrong.';
      default:
        return 'I have no idea what\'s going on.';
    }
  }

  printSubjectStatus() {
    switch (this.props.subjectStatus) {
      case SUBJECT_STATUS.IDLE:
        return 'Nothing yet';
      case SUBJECT_STATUS.FETCHING:
        return 'Hang on a second';
      case SUBJECT_STATUS.READY:
        return 'I found a subject!';
      case SUBJECT_STATUS.ERROR:
        return 'There was a problem';
      default:
        return 'What?';
    }
  }

  printProjectData() {
    if (!this.props.projectData || this.props.projectStatus !== PROJECT_STATUS.READY)
      return null;

    const project = this.props.projectData;

    return (
      <table className="data-panel">
        <tr>
          <td>ID:</td>
          <td>{project.id}</td>
        </tr>
        <tr>
          <td>Name:</td>
          <td>{project.display_name}</td>
        </tr>
        <tr>
          <td>Intro:</td>
          <td>{project.introduction}</td>
        </tr>
        <tr>
          <td>Default Workflow:</td>
          <td>{project.configuration && project.configuration.default_workflow}</td>
        </tr>
      </table>
    );
  }

  printSubjectData() {
    if (!this.props.currentSubject) {
      return null;
    }

    return (
      <table className="data-panel">
        <tr>
          <td>Current Subject ID:</td>
          <td>{this.props.currentSubject.id}</td>
        </tr>
        <tr>
          <td>Already Seen?:</td>
          <td>{this.props.currentSubject.already_seen.toString()}</td>
        </tr>
        <tr>
          <td>Subject Image:</td>
          <td>
            <img role="presentation" src={this.props.currentSubject.locations[0]['image/jpeg']} />
          </td>
        </tr>
        <tr>
          <td>Remaining queue length:</td>
          <td>{this.props.queue.length} subjects</td>
        </tr>
      </table>
    );
  }

  fetchProject() {
    this.props.dispatch(fetchProject());
  }

  fetchSubject() {
    this.props.dispatch(fetchSubject());
  }
}

ClassifierTester.propTypes = {
  currentSubject: PropTypes.object,
  dispatch: PropTypes.func,
  projectStatus: PropTypes.string,
  projectData: PropTypes.object,
  queue: PropTypes.array,
  subjectStatus: PropTypes.string,
};

ClassifierTester.defaultProps = {
  projectStatus: PROJECT_STATUS.IDLE,
  projectData: null,
};

const mapStateToProps = (state) => {
  return {
    currentSubject: state.subject.currentSubject,
    projectStatus: state.project.status,
    projectData: state.project.data,
    queue: state.subject.queue,
    subjectStatus: state.subject.status,
  };
};

export default connect(mapStateToProps)(ClassifierTester);
