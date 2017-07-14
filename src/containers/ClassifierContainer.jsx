import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { fetchProject } from '../ducks/classifier';

import SubjectViewer from './SubjectViewer';

import TmpNavigator from '../images/classify-navigator-placeholder.png';
import Divider from '../images/img_divider.png';
import TOOLBAR_CONTROLS from '../lib/toolbar-controls';

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="app-content classifier-page">
        <div className="project-background"></div>
        <section className="help-pane">
          <div className="help-directions">
            <h2>directions</h2>
            <p>
              Using the Annotate tool, click under each word in a line of text,
              then add your transcription. Clip common symbols or phrases to your
              crib sheet for reference.
            </p>
            <p>
              When you&apos;re finished, discuss the document on Talk, or move
              on to the next subject right away.
            </p>
          </div>
          <div className="help-buttons">
            <button href="#" className="white-red button">Field Guide</button>
            <button href="#" className="white-red button">Your Crib Sheet</button>
            <img className="classifier-divider" role="presentation" src={Divider} />
            <button href="#" className="white-green button">Done</button>
            <button href="#" className="green button">Done &amp; Talk</button>
          </div>
        </section>
        <SubjectViewer />
        <section className="classifier-controls">
          <div className="classifier-navigator">
            <h2>Navigator</h2>
            <img className="" role="presentation" src={TmpNavigator} />
          </div>
          <img className="classifier-divider" role="presentation" src={Divider} />
          <div className="classifier-toolbar">
            <h2>Toolbar</h2>
            {Object.keys(TOOLBAR_CONTROLS).map((key, i) => {
              return (
                <div key={i}>
                  <span className="classifier-toolbar__icon">
                    <i className={`${TOOLBAR_CONTROLS[key]}`} />
                  </span>
                  <span>{key}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}

ClassifierContainer.propTypes = {
  dispatch: PropTypes.func,
};
ClassifierContainer.defaultProps = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(ClassifierContainer);  // Connects the Component to the Redux Store
