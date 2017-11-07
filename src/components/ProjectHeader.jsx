import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { config } from '../config';

class ProjectHeader extends React.Component {
  constructor(props) {
    super(props);

    this.aboutClick = this.aboutClick.bind(this);
    this.talkClick = this.talkClick.bind(this);
  }

  aboutClick() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'header-about-click' });
    }
  }

  talkClick() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'header-talk-click' });
    }
  }

  render() {
    return(
      <div className="project-header">
        {this.props.showTitle && (
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
            <button onClick={this.aboutClick} tabIndex="-1">
              About
            </button>
          </Link>
          <a
            className="project-header__link"
            href={config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/collections'}
            target="_blank"
          >
            Collect
          </a>
          <a
            className="project-header__link"
            href={config.zooniverseLinks.host + 'projects/' + config.zooniverseLinks.projectSlug + '/talk'}
            target="_blank"
          >
            <button onClick={this.talkClick} tabIndex="-1">
              Talk
            </button>
          </a>
        </nav>
      </div>
    )
  }
}

ProjectHeader.defaultProps = {
  showTitle: false,
};

ProjectHeader.propTypes = {
  showTitle: PropTypes.bool,
};

ProjectHeader.contextTypes = {
  googleLogger: PropTypes.object
};

export default ProjectHeader;
