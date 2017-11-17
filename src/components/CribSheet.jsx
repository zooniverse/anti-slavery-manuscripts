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

  deleteItem(i) {
    const cribCopy = this.props.preferences.preferences.cribsheet.slice();
    cribCopy.splice(i, 1);
    this.props.preferences.update({ 'preferences.cribsheet': cribCopy }).save();
    this.forceUpdate();
  }

  renderItem(snippet, i) {
    return (
      <div className="crib-sheet__item" key={`SNIPPET_${i}`}>
        <button className="crib-sheet__delete" onClick={this.deleteItem.bind(this, i)}><i className="fa fa-times" /></button>
        <button>
          {snippet.cropUrl && (
            <img role="presentation" src={snippet.cropUrl} />
          )}
          <span className="crib-sheet__label">
            {snippet.name}
          </span>
        </button>
      </div>
    )
  }

  render() {
    const cribsheet = this.props.preferences.preferences.cribsheet;
    return (
      <div className="handle crib-sheet">
        <h3>Crib Sheet</h3>
        <span className="crib-sheet__instructions">Save images and notes for reference.</span>
        <div className="crib-sheet__content">
          {cribsheet && (
            cribsheet.map((snippet, i) => {
              return this.renderItem(snippet, i);
            })
          )}
          <div className="crib-sheet__add-item">
            <button onClick={this.activateCrop}>
              <i className="fa fa-plus fa-3x" />
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

CribSheet.defaultProps = {
  preferences: null,
};

CribSheet.propTypes = {
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
  }),
};

const mapStateToProps = (state) => {
  return {
    preferences: state.project.userPreferences,
  };
};

export default connect(mapStateToProps)(CribSheet);
