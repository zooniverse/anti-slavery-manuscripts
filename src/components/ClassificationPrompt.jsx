import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { connect } from 'react-redux';
import { retrieveClassification } from '../ducks/classifications';
import { fetchSubject } from '../ducks/subject';

class ClassificationPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.loadClassification = this.loadClassification.bind(this);
    this.cancelClassification = this.cancelClassification.bind(this);
  }

  loadClassification(e) {
    const id = localStorage.getItem(`${this.props.user.id}.classificationID`);

    this.props.dispatch(retrieveClassification(id));
    this.props.onClose && this.props.onClose(e);
  }

  cancelClassification(e) {
    const id = localStorage.getItem(`${this.props.user.id}.classificationID`);
    localStorage.removeItem(`${this.props.user.id}.classificationID`);

    apiClient.type('classifications/incomplete').get({ id })
    .then(([classification]) => {
      classification.delete();
    })
    .catch((err) => {
      console.warn(err);
    })
    this.props.dispatch(fetchSubject());
    this.props.onClose && this.props.onClose(e);
  }

  render() {
    return (
      <div className="classification-prompt">
        <h2>We found your saved work!</h2>
        <span>
          Would you like to continue where you left off or begin working on a
          new manuscript? <i>Note:</i> If you select "No", you will lose this
          saved work from a previous manuscript.
        </span>
        <div>
          <button className="button" onClick={this.loadClassification}>Yes</button>
          <button className="button" onClick={this.cancelClassification}>No</button>
        </div>
      </div>
    );
  }
};

ClassificationPrompt.defaultProps = {
  user: null
}

ClassificationPrompt.propTypes = {
  onClose: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string,
  })
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
  };
};

export default connect(mapStateToProps)(ClassificationPrompt);