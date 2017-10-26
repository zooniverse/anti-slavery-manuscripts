/*
Submit Classification Form
--------------------------
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  //--------
  closePopup: PropTypes.func,
};
SubmitClassificationForm.defaultProps = {
  dispatch: () => {},
  //--------
  closePopup: () => {},
};
const mapStateToProps = (state, ownProps) => {  //Listens for changes in the Redux Store
  return {};
};
export default connect(mapStateToProps)(SubmitClassificationForm);  //Connects the Component to the Redux Store
