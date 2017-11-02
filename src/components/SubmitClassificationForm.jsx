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
    let numberOfAnswersMatchQuestions = true;
    
    if (this.props.subjectCompletionAnswers && this.props.workflowData) {
      const numberOfQuestions = Object.keys(this.props.workflowData.tasks)
      .map((taskId) => {
        return Object.assign({},
          this.props.workflowData.tasks[taskId],
          { taskId }
        );
      })
      .filter((task) => {
        return isAQuestionTask(task, this.props.workflowData);
      })
      .length;
      const numberOfAnswers = Object.keys(this.props.subjectCompletionAnswers).length;
      numberOfAnswersMatchQuestions = numberOfQuestions === numberOfAnswers;
    }
    
    return (
      <div className="submit-classification-form">
        <h2>Submit Classification</h2>
        {this.renderSubjectCompletionQuestions()}
        <div className="action-buttons">
          <button href="#" className="white-green button" onClick={() => { this.props.closePopup && this.props.closePopup(); }}>Cancel</button>
          <button href="#" disabled={!numberOfAnswersMatchQuestions} className={(numberOfAnswersMatchQuestions) ? 'white-green button' : 'disabled button'} onClick={this.completeClassification}>Done</button>
          <button href="#" disabled={!numberOfAnswersMatchQuestions} className={(numberOfAnswersMatchQuestions) ? 'green button' : 'disabled button'} onClick={this.submitClassificationAndRedirect}>
            Done &amp; Talk
          </button>
        </div>
      </div>
    );
  }
  
  completeClassification() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'complete-classification' });
    }
    
    this.props.dispatch(submitClassification())
    this.props.closePopup && this.props.closePopup();
  }

  submitClassificationAndRedirect() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'complete-classification-and-talk' });
    }
    
    this.props.dispatch(submitClassification())
    this.props.closePopup && this.props.closePopup();
    window.open(config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/talk', '_blank');
  }
  
  /*  This function renders all the non-transcription Panoptes tasks (i.e.
      questions) provided by the workflow.
      A special note on the way that this Panoptes transcription project is
      constructred is that the first task is IMPLICITLY the transcription
      (i.e. mark all the lines of text on this page) task, and is treated in a
      special manner.
      This is fairly brittle, but functional for a custom front end project.
      Worth improving in the future, though.
   */
  renderSubjectCompletionQuestions() {
    if (!this.props.workflowData) return null;
    
    //Display all question tasks, except for the first task.
    const tasks = (this.props.workflowData.tasks)
      ? Object.keys(this.props.workflowData.tasks)
        .map((taskId) => {
          return Object.assign({},
            this.props.workflowData.tasks[taskId],
            { taskId }
          );
        })
        .filter((task) => {
          return isAQuestionTask(task, this.props.workflowData);
        })
      : [];
    
    return (
      <div className="tasks body-copy">
        {tasks.map((task, taskIndex) =>{
          return (
            <div
              className="single-task"
              key={`submit-classification-form-task-${taskIndex}`}
            >
              <div className="question">{task.question}</div>
              <div className="answers">
                {task.answers.map((answer, answerIndex) => {
                  const answerValue = answerIndex;  //For the aggregation system, the answer value of a Q&A task should be the answer's array index.
                  const checked = this.props.subjectCompletionAnswers &&
                    this.props.subjectCompletionAnswers[task.taskId] === answerValue;
                  return (
                    <label
                      className="single-answer"
                      key={`submit-classification-form-task-${taskIndex}-answer-${answerIndex}`}
                    >
                      <input
                        type="radio"
                        value={answerValue}
                        checked={checked}
                        onChange={() => {
                          this.props.dispatch(setSubjectCompletionAnswers(task.taskId, answerValue));
                        }}
                      />
                      <span>{answer.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

function isAQuestionTask(task, workflow) {
  return (
    task.taskId !== workflow.first_task &&
    task.type === 'single' &&  //Hardcoded: PFE 'single question' type
    task.question && task.answers && task.answers.length > 0
  );
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
SubmitClassificationForm.contextTypes = {
  googleLogger: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  return {
    subjectCompletionAnswers: state.classifications.subjectCompletionAnswers,
    workflowData: state.workflow.data,
    classification: state.classifications.classification,
  };
};
export default connect(mapStateToProps)(SubmitClassificationForm);  //Connects the Component to the Redux Store
