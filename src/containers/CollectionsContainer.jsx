import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client.js';
import { selectCollection } from '../ducks/collections';
import { connect } from 'react-redux';
import CollectionsManager from '../components/CollectionsManager';

class CollectionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };

    this.addToCollections = this.addToCollections.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.searchCollections = this.searchCollections.bind(this);
  }

  addToCollections() {
    if (this.props.selectedCollections.length) {
      this.props.selectedCollections.forEach((item) => {
        item.collection.addLink('subjects', [this.props.currentSubject.id])
          .then(() => { this.props.closePopup(); })
          .catch((e) => {
            this.setState({ error: e.toString() });
          });
      });
    }
  }

  onChange(collection) {
    this.props.dispatch(selectCollection(collection))
  }

  onSubmit(display_name, privateChecked) {
    const links = {
      project: this.props.project.id,
      subjects: [this.props.currentSubject.id]
    };
    const collection = { display_name, private: privateChecked, links };

    apiClient.type('collections').create(collection).save()
      .then(() => {
        this.props.closePopup();
      })
      .catch((e) => {
        this.setState({ error: e.toString() });
      });
  }

  searchCollections(value) {
    let options;
    const query = {
      page_size: 20,
      favorite: false,
      current_user_roles: 'owner, collaborator, contributor',
    };
    if (value !== '') {
      query.search = `${value}`;
    }
    return apiClient.type('collections').get(query).then((collections) => {
      options = collections.map((collection) => {
        return {
          value: collection.id,
          label: collection.display_name,
          collection
        };
      });
      return { options };
    })
      .catch((e) => {
        this.setState({ error: e.toString() });
      });
  }

  render() {
    return (
      <CollectionsManager
        addToCollections={this.addToCollections}
        error={this.state.error}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        searchCollections={this.searchCollections}
      />
    )
  }
}

CollectionContainer.propTypes = {
  closePopup: PropTypes.func,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
  }),
  dispatch: PropTypes.func,
  project: PropTypes.shape({
    id: PropTypes.string,
  }),
  selectedCollections: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => ({
  currentSubject: state.subject.currentSubject,
  project: state.project,
  selectedCollections: state.collections.selectedCollections,
});

export default connect(mapStateToProps)(CollectionContainer);  // Connects the Component to the Redux Store
