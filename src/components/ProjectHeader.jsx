import React from 'react';
import { Link } from 'react-router';

class ProjectHeader extends React.Component {
  render() {
    return (
      <div className="project-header">
        <h1>Anti-Slavery Manuscripts</h1>
        <nav className="project-header__nav">
          <Link
            activeClassName="project-header__link--active"
            className="project-header__link"
            onlyActiveOnIndex={true}
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
          >
            About <i>the</i> Collection
          </Link>
        </nav>
      </div>
    );
  }
}

export default ProjectHeader;
