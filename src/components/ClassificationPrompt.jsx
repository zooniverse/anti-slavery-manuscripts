import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { connect } from 'react-redux';
import { retrieveClassification } from '../ducks/classifications';
import { fetchWorkflow } from '../ducks/workflow';
import { fetchSubject } from '../ducks/subject';
import { setVariant } from '../ducks/splits';

class ClassificationPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.loadClassification = this.loadClassification.bind(this);
    this.cancelClassification = this.cancelClassification.bind(this);
  }

  loadClassification(e) {
    const classification_id = localStorage.getItem(`${this.props.user.id}.manual_save_classificationID`);
    const workflow_id = localStorage.getItem(`${this.props.user.id}.manual_save_workflowID`);
    const variant = localStorage.getItem(`${this.props.user.id}.manual_save_variant`);
    
    this.props.dispatch(fetchWorkflow(workflow_id)).then(() => {
      this.props.dispatch(retrieveClassification(classification_id));
      this.props.dispatch(setVariant(variant));
    });
    
    this.props.onClose && this.props.onClose(e);
  }

  cancelClassification(e) {
    const id = localStorage.getItem(`${this.props.user.id}.manual_save_classificationID`);
    localStorage.removeItem(`${this.props.user.id}.manual_save_classificationID`);
    localStorage.removeItem(`${this.props.user.id}.manual_save_workflowID`);
    localStorage.removeItem(`${this.props.user.id}.manual_save_variant`);

    this.props.onClose && this.props.onClose(e);
    
    return apiClient.type('classifications/incomplete').get({ id })
      .then(([classification]) => {
        classification.delete();
      })
      .catch((err) => {
        console.warn('ClassificationPrompt.cancelClassification() warning: ', err);
      });
  }

  render() {
    return (
      <div className="classification-prompt">
        <h2>We found your saved work!</h2>
        <span>
          Would you like to continue your saved transcription or begin working on a
          new manuscript?
        </span>
        <span>
          <i>Note:</i> If you select &quot;New Manuscript&quot;, you will lose any
          saved work from a previous manuscript.
        </span>
        <div>
          <button className="button" onClick={this.cancelClassification}>New Manuscript</button>
          <button className="button" onClick={this.loadClassification}>Continue Saved</button>
        </div>
      </div>
    );
  }
}

ClassificationPrompt.defaultProps = {
  user: null,
};

ClassificationPrompt.propTypes = {
  dispatch: PropTypes.func,
  onClose: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
  };
};

export default connect(mapStateToProps)(ClassificationPrompt);
