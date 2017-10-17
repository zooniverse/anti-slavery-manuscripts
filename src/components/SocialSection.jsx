import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';
import { getSubjectLocation, getThumbnailSource } from '../lib/get-subject-location';

const SocialSection = ({ classifications, completedSubjects, percentComplete, project, subjects, subjectsOfNote, volunteers }) =>
  <div className="home-page__social-section">

    {subjectsOfNote && subjectsOfNote.length && (
      <div>
        <h2 className="main-title">Subjects<i>of</i>  Note</h2>
        <img role="presentation" className="divider" src={Divider} />
        <div className="home-page__subject-row flex-row">

          {subjectsOfNote.map((subject, i) => {
            const location = getSubjectLocation(subject);
            const thumbnail = getThumbnailSource(location.src);
            return (
              <div key={i}>
                <img src={thumbnail} />
              </div>
            )
          })}

        </div>
      </div>
    )}

    <h2 className="main-title">Community</h2>
    <img role="presentation" className="divider" src={Divider} />
    <div className="home-page__project-stats flex-row">
      <div>
        <h3 className="main-title">Project Statistics</h3>
        <span className="body-copy">
          Check back for updated stats on Anti-Slavery Manuscripts.
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
          {project.researcher_quote}
        </span>
      </div>
      <div className="home-page__news-section flex-row">
        <div className="social-bar fa-2x">
          <a href="https://twitter.com/BPLBoston" target="_blank"><i className="fa fa-twitter"/></a>
          <a href="https://www.facebook.com/bostonpubliclibrary/" target="_blank"><i className="fa fa-facebook"/></a>
          <a href="https://www.instagram.com/bplboston" target="_blank"><i className="fa fa-instagram"/></a>
        </div>
        <div>
          <h3 className="main-title">In the News</h3>
          <span>
            Check back for updates on Anti-Slavery Manuscripts.
          </span>
        </div>
      </div>
    </div>
  </div>;

SocialSection.defaultProps = {
  classifications: 0,
  completedSubjects: 0,
  percentComplete: 0,
  project: {
    researcher_quote: ''
  },
  subjects: 0,
  subjectsOfNote: [],
  volunteers: 0,
};

SocialSection.propTypes = {
  classifications: PropTypes.number,
  completedSubjects: PropTypes.number,
  percentComplete: PropTypes.number,
  project: PropTypes.shape({
    researcher_quote: ''
  }),
  subjects: PropTypes.number,
  subjectsOfNote: PropTypes.arrayOf(PropTypes.object),
  volunteers: PropTypes.number,
};

export default SocialSection;
