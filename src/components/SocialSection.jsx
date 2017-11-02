import React from 'react';
import PropTypes from 'prop-types';
import Divider from '../images/img_divider.png';
import { getSubjectLocation, getThumbnailSource } from '../lib/get-subject-location';

const SocialSection = ({ project, subjectsOfNote }) =>
  <div className="home-page__social-section">

    {subjectsOfNote && subjectsOfNote.length ? (
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
    ) : false}

    <h2 className="main-title">Community</h2>
    <img role="presentation" className="divider" src={Divider} />
    <div className="home-page__project-stats flex-row">
      <div>
        <h3 className="main-title">Project Statistics</h3>
        <span className="body-copy">
          Check back for updated stats on Anti-Slavery Manuscripts.
        </span>
        <div className="home-page__progress-bar">
          <div className="completed" style={{ minWidth: "2em", width: `${project || project.completeness || 0}%` }}>
            <span>
              {project && project.completeness || 0}%
            </span>
          </div>
        </div>
        <br />
        <p className="secondary-head">Percent Completed</p>
      </div>
      <div className="home-page__numbers">
        <div>
          <span className="secondary-head">
            <p>{project && project.classifiers_count && project.classifiers_count.toLocaleString()}</p>
            Volunteers
          </span>
          <span className="secondary-head">
            <p>{project && project.subjects_count && project.subjects_count.toLocaleString()}</p>
            Subjects
          </span>
        </div>
        <div>
          <span className="secondary-head">
            <p>{project && project.classifications_count && project.classifications_count.toLocaleString()}</p>
            Classifications
          </span>
          <span className="secondary-head">
            <p>{project && project.retired_subjects_count && project.retired_subjects_count.toLocaleString()}</p>
            Completed Subjects
          </span>
        </div>
      </div>
    </div>
    <div className="home-page__social-content flex-row">
      <div>
        <h3 className="main-title">Message from the researchers</h3>
        <span>
          {project && project.researcher_quote}
        </span>
      </div>
      <div className="home-page__news-section">
        <div>
          <h3 className="main-title">In the News</h3>
          <span>
            Connect on social media for updates
          </span>
        </div>
        <div className="social-bar">
          <div>
            <a href="https://twitter.com/BPLBoston" target="_blank">
              <i className="fa fa-twitter fa-2x"/>
              <div>
                <span>Twitter</span>
                <span>@BPLBostom</span>
              </div>
            </a>
          </div>
          <div>
            <a href="https://www.facebook.com/bostonpubliclibrary/" target="_blank">
              <i className="fa fa-facebook fa-2x"/>
              <div>
                <span>Facebook</span>
                <span>@bostonpubliclibrary</span>
              </div>
            </a>
          </div>
          <div>
            <a href="https://www.instagram.com/bplboston" target="_blank">
              <i className="fa fa-instagram fa-2x"/>
              <div>
                <span>Instagram</span>
                <span>@bplboston</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>;

SocialSection.defaultProps = {
  percentComplete: 0,
  project: {
    classifiers_count: 0,
    completeness: 0,
    researcher_quote: '',
    retired_subjects_count: 0,
    subjects_count: 0
  },
  subjectsOfNote: [],
};

SocialSection.propTypes = {
  percentComplete: PropTypes.number,
  project: PropTypes.shape({
    classifiers_count: PropTypes.number,
    completeness: PropTypes.number,
    researcher_quote: PropTypes.string,
    retired_subjects_count: PropTypes.number,
    subjects_count: PropTypes.number,

  }),
  subjectsOfNote: PropTypes.arrayOf(PropTypes.object),
};

export default SocialSection;
