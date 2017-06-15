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

class ClassifierTester extends React.Component {
  constructor(props) {
    super(props);
    this.fetchProject = this.fetchProject.bind(this);
  }

  render() {
    return (
      <main className="app-content tester-page">
        <div className="control-panel">
          <button className="green button" onClick={this.fetchProject}>Fetch Project</button>
        </div>
        <div className="status-panel">
          {this.printProjectStatus()}
        </div>
        {this.printProjectData()}
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
  
  fetchProject() {
    this.props.dispatch(fetchProject());
  }
}

ClassifierTester.propTypes = {
  dispatch: PropTypes.func,
  projectStatus: PropTypes.string,
  projectData: PropTypes.object,
};

ClassifierTester.defaultProps = {
  projectStatus: PROJECT_STATUS.IDLE,
  projectData: null,
};

const mapStateToProps = (state) => {
  return {
    projectStatus: state.project.status,
    projectData: state.project.data,
  }
};

export default connect(mapStateToProps)(ClassifierTester);