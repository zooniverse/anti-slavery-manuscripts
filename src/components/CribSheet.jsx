import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CribSheet extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem() {
    return (
      <div className="crib-sheet__item">
        <div className="crib-sheet__label">
          Item Name
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="crib-sheet">
        <h3>Crib Sheet</h3>
        <span>Save images and notes for reference.</span>
        {this.renderItem()}
        <div className="crib-sheet__item">
          <button>
            <i className="fa fa-plus" />
          </button>
          <div className="crib-sheet__label">
            Add New Item
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
