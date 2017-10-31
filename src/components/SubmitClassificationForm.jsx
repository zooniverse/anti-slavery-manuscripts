/*
Submit Classification Form
--------------------------
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { config } from '../config';
import {
  createClassification, submitClassification,
  setSubjectCompletionAnswers,
} from '../ducks/classifications';

class SubmitClassificationForm extends React.Component {
  constructor(props) {
    super(props);
  
    this.completeClassification = this.completeClassification.bind(this);
    this.submitClassificationAndRedirect = this.submitClassificationAndRedirect.bind(this);
  }

  //----------------------------------------------------------------

  render() {
    console.log('== WORKFLOW ==\n', this.props.workflowData);
    console.log('== CLASSIFICATION ==\n', this.props.classification);
    console.log(this.props);
    
    return (
      <div>
        {this.renderSubjectCompletionQuestions()}
        
        <div>
          <button href="#" className="white-green button" onClick={this.completeClassification}>Done</button>
          <button href="#" className="green button" onClick={this.submitClassificationAndRedirect}>
            Done &amp; Talk
          </button>
        </div>
      </div>
    );
  }
  
  completeClassification() {
    this.props.dispatch(submitClassification())
    this.props.closePopup && this.props.closePopup();
  }

  submitClassificationAndRedirect() {
    this.completeClassification();
    window.open(config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/talk', '_blank');
  }
  
  renderSubjectCompletionQuestions() {
    if (!this.props.workflowData) return null;
    
    
    

    return (
      <div>
        ...
      </div>
    );
  }

}

SubmitClassificationForm.propTypes = {
  dispatch: PropTypes.func,
  closePopup: PropTypes.func,
  //--------
  subjectCompletionAnswers: PropTypes.object,
  workflowData: PropTypes.object,
};
SubmitClassificationForm.defaultProps = {
  dispatch: () => {},
  closePopup: () => {},
  //--------
  subjectCompletionAnswers: null,
  workflowData: null,
};
const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  return {
    subjectCompletionAnswers: state.classifications.subjectCompletionAnswers,
    workflowData: state.workflow.data,
    classification: state.classifications.classification,
  };
};
export default connect(mapStateToProps)(SubmitClassificationForm);  //Connects the Component to the Redux Store
