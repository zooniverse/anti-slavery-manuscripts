import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setViewerState, SUBJECTVIEWER_STATE } from '../ducks/subject-viewer';

class CribSheet extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.activateCrop = this.activateCrop.bind(this);
    this.activateCard = this.activateCard.bind(this);
    this.deactivateCard = this.deactivateCard.bind(this);
    this.renderActiveCard = this.renderActiveCard.bind(this);
    this.renderAllCards = this.renderAllCards.bind(this);

    this.state = {
      activeCard: null,
    };
  }

  activateCrop(e) {
    this.props.dispatch(setViewerState(SUBJECTVIEWER_STATE.CROPPING));
    this.props.onClose && this.props.onClose(e);
  }

  deleteItem(i) {
    if (this.props.preferences.preferences && this.props.preferences.preferences.cribsheet) {
      const cribCopy = this.props.preferences.preferences.cribsheet.slice();
      cribCopy.splice(i, 1);
      this.props.preferences.update({ 'preferences.cribsheet': cribCopy }).save();
      this.forceUpdate();
    }
  }

  activateCard(activeCard) {
    this.setState({ activeCard });
  }

  deactivateCard() {
    this.setState({ activeCard: null });
  }

  renderActiveCard() {
    if (!this.state.activeCard) { return null; }
    const card = this.state.activeCard;
    return (
      <div className="active-card">
        <button onClick={this.deactivateCard}>
          <i className="fa fa-arrow-left" /> Back
        </button>

        <div className="active-card__content">
          {this.state.activeCard.cropUrl && (
            <div>
              <img alt="Cribsheet Selection" src={this.state.activeCard.cropUrl} />
            </div>
          )}

          <div>
            {card.name && (
              <h2>{card.name}</h2>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderItem(snippet, i) {
    return (
      <div className="crib-sheet__item" key={`SNIPPET_${i}`}>
        <button
          className="crib-sheet__delete"
          onClick={this.deleteItem.bind(this, i)}
        >
          <i className="fa fa-times" />
        </button>

        <button onClick={this.activateCard.bind(this, snippet)}>
          {snippet.cropUrl && (
            <img role="presentation" src={snippet.cropUrl} />
          )}
          <span className="crib-sheet__label">
            {snippet.name}
          </span>
        </button>

      </div>
    );
  }

  renderAllCards() {
    const cribsheet = this.props.preferences.preferences.cribsheet;
    return (
      <div>
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

  render() {
    return (
      <div className="handle crib-sheet">
        {this.state.activeCard && (this.renderActiveCard())}

        {!this.state.activeCard && (this.renderAllCards())}
      </div>
    );
  }
}

CribSheet.defaultProps = {
  preferences: null,
};

CribSheet.propTypes = {
  dispatch: PropTypes.func,
  onClose: PropTypes.func,
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
    update: PropTypes.func,
  }),
};

const mapStateToProps = (state) => {
  return {
    preferences: state.project.userPreferences,
  };
};

export default connect(mapStateToProps)(CribSheet);
