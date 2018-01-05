import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';

class CollectionsManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = { disableAdd: true };

    this.onAdd = this.onAdd.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  onAdd() {
    this.props.addToCollections();
    this.props.onChange([]);
  }

  handleInputChange() {
    const emptyField = this.create.value.length === 0;

    if (!emptyField && this.state.disableAdd === true) {
      this.setState({ disableAdd: false });
    } else if (emptyField && this.state.disableAdd === false) {
      this.setState({ disableAdd: true });
    }
  }

  handleSubmission(e) {
    e.preventDefault();
    const value = this.create.value;
    const privateChecked = this.private.checked;

    this.props.onSubmit(value, privateChecked);
  }

  render() {
    const disableAdd = !this.props.selectedCollections.length;
    return (
      <div className="collections-manager">
        <h2 className="secondary-head">Add Subject to Collection</h2>

        <div className="collections-manager__search">
          <Select.Async
            multi
            onChange={this.props.onChange}
            value={this.props.selectedCollections}
            placeholder="Type to search Collections"
            searchPromptText="Type to search Collections"
            className="collections-manager__search"
            loadOptions={this.props.searchCollections}
          />
          <button className="button" disabled={disableAdd} type="button" onClick={this.onAdd}>
            Add
          </button>
        </div>

        <hr />

        <div>Or create a new Collection</div>

        <div className="collections-manager__create">
          <form className="collections-create-form" onSubmit={this.handleSubmission}>
            <input className="collection-name-input" ref={(el) => {this.create = el; }} onChange={this.handleInputChange} placeholder="Collection Name" />
            <div className="collections-manager__form-actions">
              <label>
                <input type="checkbox" ref={(el) => { this.private = el; }} defaultChecked={false} />Private
              </label>
              <div className="submit-button-container">
                <button className="button" disabled={this.state.disableAdd} type="submit">Add to Collection</button>
              </div>
            </div>
            {this.props.error && (
              <div className="collections-manager__error">
                {this.props.error}
              </div>
            )}
          </form>
        </div>

      </div>

    );
  }
}

CollectionsManager.propTypes = {
  error: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  searchCollections: PropTypes.func,
  selectedCollections: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => ({
  selectedCollections: state.collections.selectedCollections,
});

export default connect(mapStateToProps)(CollectionsManager);
