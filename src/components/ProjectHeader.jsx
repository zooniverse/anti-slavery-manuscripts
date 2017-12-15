import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { config } from '../config';
import { VARIANT_TYPES } from '../ducks/splits';

class ProjectHeader extends React.Component {
  constructor(props) {
    super(props);

    this.aboutClick = this.aboutClick.bind(this);
    this.talkClick = this.talkClick.bind(this);
    this.feedbackVariant = this.feedbackVariant.bind(this);
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

  feedbackVariant() {
    return this.props.variant === VARIANT_TYPES.INDIVIDUAL
      ? 'https://goo.gl/forms/h0V82sJQ4zEmveCH3'  //Individual-type users.
      : 'https://goo.gl/forms/7Ur0kCxD1ZIPjNgA2';  //Collaborative-type users.
  }

  render() {
    const isAdmin = this.props.user && this.props.user.admin ?
      '' : 'project-header__disabled';

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
            className={`project-header__link ${isAdmin}`}
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
            href={this.feedbackVariant()}
            rel="noopener noreferrer"
            target="_blank"
          >
            Feedback
          </a>
        </nav>
      </div>
    );
  }
}

ProjectHeader.defaultProps = {
  showTitle: false,
  user: null,
  variant: VARIANT_TYPES.INDIVIDUAL,
};

ProjectHeader.propTypes = {
  showTitle: PropTypes.bool,
  user: PropTypes.shape({
    admin: PropTypes.bool,
  }),
  variant: PropTypes.string,
};

ProjectHeader.contextTypes = {
  googleLogger: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    variant: state.splits.variant,
  };
};

export default connect(mapStateToProps)(ProjectHeader);
