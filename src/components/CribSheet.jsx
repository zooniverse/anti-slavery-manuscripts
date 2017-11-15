import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setViewerState, SUBJECTVIEWER_STATE } from '../ducks/subject-viewer'

class CribSheet extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.activateCrop = this.activateCrop.bind(this);
  }

  activateCrop(e) {
    this.props.onClose && this.props.onClose(e);
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.CROPPING));
  }

  renderItem() {
    return (
      <div className="crib-sheet__item">
        <button>
          <span className="crib-sheet__label">
            Item notes
          </span>
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="crib-sheet">
        <h3>Crib Sheet</h3>
        <span>Save images and notes for reference.</span>
        <div className="crib-sheet__content">
          {this.renderItem()}
          <div className="crib-sheet__item">
            <button onClick={this.activateCrop}>
              <i className="fa fa-plus" />
              <span className="crib-sheet__label">
                Add New Item
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

CribSheet.propTypes = {
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(CribSheet);
