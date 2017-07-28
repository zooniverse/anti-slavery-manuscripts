import React from 'react';
import PropTypes from 'prop-types';

const FavoritesButton = ({ favorite, toggleFavorite }) => {
  const heart = favorite ? "fa fa-heart" : "fa fa-heart-o"
  return (
    <button className="flat-button block" onClick={toggleFavorite}>
      <span className="classifier-toolbar__icon">
        <i className={heart} />
      </span>
      <span>Favorite</span>
    </button>
  );
};

FavoritesButton.defaultProps = {
  favorite: false
};

FavoritesButton.propTypes = {
  favorite: PropTypes.bool,
  toggleFavorite: PropTypes.func.isRequired,
};

export default FavoritesButton;
