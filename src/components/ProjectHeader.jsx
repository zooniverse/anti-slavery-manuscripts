import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const ProjectHeader = ({ onIndex }) =>
  <div className="project-header">
    {!onIndex && (
      <h1 className="main-title">Anti-Slavery Manuscripts</h1>
    )}
    <nav className="project-header__nav">
      <Link
        activeClassName="project-header__link--active"
        className="project-header__link"
        onlyActiveOnIndex
        to="/"
      >
        Home
      </Link>
      <Link
        activeClassName="project-header__link--active"
        className="project-header__link"
        to="/classify"
      >
        Transcribe
      </Link>
      <Link
        activeClassName="project-header__link--active"
        className="project-header__link"
      >
        About
      </Link>
      <Link
        activeClassName="project-header__link--active"
        className="project-header__link"
      >
        Collect
      </Link>
      <Link
        activeClassName="project-header__link--active"
        className="project-header__link"
        to="/about-the-collection"
      >
        About <i>the</i> Collection
      </Link>
    </nav>
  </div>;

ProjectHeader.defaultProps = {
  onIndex: false,
};

ProjectHeader.propTypes = {
  onIndex: PropTypes.bool,
};

export default ProjectHeader;
