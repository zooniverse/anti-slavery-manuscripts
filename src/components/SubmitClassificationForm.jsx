/*
Submit Classification Form
--------------------------
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setSubjectCompletionAnswers } from '../ducks/classifications';

class SubmitClassificationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------

  render() {
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
};
SubmitClassificationForm.defaultProps = {
  dispatch: () => {},
  closePopup: () => {},
  //--------
  subjectCompletionAnswers: null,
};
const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  return {
    subjectCompletionAnswers: state.classifications.subjectCompletionAnswers,
  };
};
export default connect(mapStateToProps)(SubmitClassificationForm);  //Connects the Component to the Redux Store
