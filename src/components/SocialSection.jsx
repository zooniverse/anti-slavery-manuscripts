import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';

const SocialSection = ({ classifications, completedSubjects, percentComplete, subjects, volunteers }) =>
  <div className="home-page__social-section">
    <h2 className="main-title">Subjects<i>of</i>  Note</h2>
    <img role="presentation" className="divider" src={Divider} />
    <div className="home-page__subject-row flex-row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <h2 className="main-title">Community</h2>
    <img role="presentation" className="divider" src={Divider} />
    <div className="home-page__project-stats flex-row">
      <div>
        <h3 className="main-title">Project Statistics</h3>
        <span className="body-copy">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rhoncus
          facilisis est. Etiam gravida non elit quis retrum. Vestibulum ut
          hendrerit felis. Etiam sit amet libero lorem. Nam auctor rhoncus nisl.
        </span>
        <div className="home-page__progress-bar">
          <div className="completed" style={{ minWidth: "2em", width: `${percentComplete}%` }}>
            <span>
              {percentComplete}%
            </span>
          </div>
        </div>
        <br />
        <p className="secondary-head">Percent Completed</p>
      </div>
      <div className="home-page__numbers">
        <div>
          <span className="secondary-head">
            <p>{volunteers}</p>
            Volunteers
          </span>
          <span className="secondary-head">
            <p>{subjects}</p>
            Subjects
          </span>
        </div>
        <div>
          <span className="secondary-head">
            <p>{classifications}</p>
            Classifications
          </span>
          <span className="secondary-head">
            <p>{completedSubjects}</p>
            Completed Subjects
          </span>
        </div>
      </div>
    </div>
    <div className="home-page__social-content flex-row">
      <div>
        <h3 className="main-title">Message from the researchers</h3>
        <span>
          Lopem upsum dolor sit amet, consectetur adipiscing elit? Aliquan elemeum,
          msif iaculis eleifend porttitor, nisl aliqua?
        </span>
      </div>
      <div className="home-page__news-section flex-row">
        <div className="social-bar fa-2x">
          <i className="fa fa-twitter"/>
          <i className="fa fa-facebook"/>
          <i className="fa fa-instagram"/>
        </div>
        <div>
          <h3 className="main-title">In the News</h3>
          <span>
            Lopem upsum dolor sit amet, consectetur adipiscing elit? Aliquan elemeum,
            msif iaculis eleifend porttitor, nisl aliqua?
          </span>
        </div>
      </div>
    </div>
  </div>;

SocialSection.defaultProps = {
  classifications: 0,
  completedSubjects: 0,
  percentComplete: 0,
  subjects: 0,
  volunteers: 0,
};

SocialSection.propTypes = {
  classifications: PropTypes.number,
  completedSubjects: PropTypes.number,
  percentComplete: PropTypes.number,
  subjects: PropTypes.number,
  volunteers: PropTypes.number,
};

export default SocialSection;
