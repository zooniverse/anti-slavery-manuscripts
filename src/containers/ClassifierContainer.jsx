import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { fetchProject } from '../ducks/classifier';

import TmpSvgIcon from '../components/TmpSvgIcon';
import TmpNavigator from '../images/classify-navigator-placeholder.png';
import TOOLBAR_CONTROLS from '../lib/toolbar-controls';

class ClassifierContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="app-content classifier-page">
        <section className="help-pane">
          <div className="help-directions">
            <b>directions</b>
            <p>
              Using the Annotate tool, click under each word in a line of text,
              then add your transcription. Clip common symbols or phrases to your
              crib sheet for reference. When you&apos;re finished
            </p>
          </div>
          <div className="help-buttons">
            <button href="#" className="white-blue button">Field Guide</button>
            <button href="#" className="white-blue button">Your Crib Sheet</button>
            <hr />
            <button href="#" className="white-green button">Done</button>
            <button href="#" className="green button">Done &amp; Talk</button>
          </div>
        </section>
        <section className="subject-viewer">
          <div className="subject-images">
            <div className="subject-image"></div>
          </div>
        </section>
        <section className="classifier-controls">
          <div className="classifier-navigator">
            <b>Navigator</b>
            <img className="" role="presentation" src={TmpNavigator} />
          </div>
          <div className="classifier-toolbar">
            <b>Toolbar</b><i className="fa fa-chevron-right" />
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
