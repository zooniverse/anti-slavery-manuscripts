import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { config } from '../config';

const ProjectHeader = ({ showTitle }) =>
  <div className="project-header">
    {showTitle && (
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
        to="/about"
      >
        About
      </Link>
      <a
        className="project-header__link"
        href={config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/collections'}
      >
        Collect
      </a>
      <a
        className="project-header__link"
        href={config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/talk'}
      >
        Talk
      </a>
    </nav>
  </div>;

ProjectHeader.defaultProps = {
  showTitle: false,
};

ProjectHeader.propTypes = {
  showTitle: PropTypes.bool,
};

export default ProjectHeader;
