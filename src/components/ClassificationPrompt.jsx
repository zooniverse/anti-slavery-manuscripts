import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { retrieveClassification } from '../ducks/classifications';

class ClassificationPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.loadClassification = this.loadClassification.bind(this);
    this.cancelClassification = this.cancelClassification.bind(this);
  }

  loadClassification(e) {
    const id = localStorage.getItem('classificationID');

    this.props.dispatch(retrieveClassification(id));
    this.props.onClose && this.props.onClose(e);
  }

  cancelClassification(e) {

    this.props.onClose && this.props.onClose(e);
  }

  render() {
    return (
      <div>
        <h3>Do you want to continue a recent classification</h3>
        <button onClick={this.loadClassification}>Yes</button>
        <button onClick={this.cancelClassification}>No</button>
      </div>
    );
  }
};

ClassificationPrompt.propTypes = {
  onClose: PropTypes.func
}

export default connect()(ClassificationPrompt);
