import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { config } from '../config';

class ProjectHeader extends React.Component {
  constructor(props) {
    super(props);

    this.aboutClick = this.aboutClick.bind(this);
    this.talkClick = this.talkClick.bind(this);
    this.blogClick = this.blogClick.bind(this);
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

  blogClick() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'header-blog-click' });
    }
  }

  render() {
    return (
      <div id="project-header" className="project-header">
        {this.props.showTitle && (
          <h1 className="main-title">Anti-Slavery Manuscripts</h1>
        )}
        <nav className="project-header__nav">
          <NavLink
            activeClassName="project-header__link--active"
            className="project-header__link"
            exact
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            activeClassName="project-header__link--active"
            className="project-header__link"
            to="/classify"
          >
            Transcribe
          </NavLink>

          <NavLink
            activeClassName="project-header__link--active"
            className="project-header__link"
            to="/about"
          >
            <button onClick={this.aboutClick} tabIndex="-1">
              About
            </button>
          </NavLink>
          <a
            className="project-header__link"
            href={`${config.zooniverseLinks.host}projects/${config.zooniverseLinks.projectSlug}/collections`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Collect
          </a>
          <a
            className="project-header__link"
            href={`${config.zooniverseLinks.host}projects/${config.zooniverseLinks.projectSlug}/talk`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <button onClick={this.talkClick} tabIndex="-1">
              Talk
            </button>
          </a>
          <a
            className="project-header__link"
            href="https://www.zooniverse.org/projects/bostonpubliclibrary/anti-slavery-manuscripts/stats"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stats
          </a>
          <a
            className="project-header__link"
            href="https://www.bpl.org/distinction/tag/anti-slavery-manuscripts/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <button onClick={this.blogClick} tabIndex="-1">
              Blog
            </button>
          </a>
        </nav>
      </div>
    );
  }
}

ProjectHeader.defaultProps = {
  showTitle: false,
  user: null,
};

ProjectHeader.propTypes = {
  showTitle: PropTypes.bool,
  user: PropTypes.shape({
    admin: PropTypes.bool,
  }),
};

ProjectHeader.contextTypes = {
  googleLogger: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
  };
};

export default connect(mapStateToProps)(ProjectHeader);
