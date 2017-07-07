import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class ProjectHeader extends React.Component {
  render() {
    const onHome = this.props.onIndex ? 'project-header__home-nav' : ''
    return (
      <div className={`project-header ${onHome}`}>
        {!this.props.onIndex && (
          <h1 className="title-header">Anti-Slavery Manuscripts</h1>
        )}
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

ProjectHeader.defaultProps = {
  onIndex: false,
};

ProjectHeader.propTypes = {
  onIndex: PropTypes.bool,
};

export default ProjectHeader;
