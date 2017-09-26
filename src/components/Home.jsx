import React from 'react';
import { ZooniverseLogotype, ZooniverseLogo } from 'zooniverse-react-components';
import SocialSection from '../components/SocialSection';
import Divider from '../images/img_divider.png';
import BostonLogo from '../images/BPL_logo.jpg';
import LetterGroups from '../lib/letter-groups';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      backgroundHeight: 'auto',
    };
    this.resizeBackground = this.resizeBackground.bind(this);
  }

  componentDidMount() {
    this.resizeBackground();
    addEventListener('resize', this.resizeBackground);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resizeBackground);
  }

  resizeBackground() {
    const content = document.getElementById('home-logos');
    if (content) {
      const contentBottom = content.getBoundingClientRect().top;
      const sectionHeight = document.body.scrollTop + contentBottom;
      if (this.state.backgroundHeight !== sectionHeight) {
        this.setState({ backgroundHeight: sectionHeight });
      }
    }
  }

  renderTopics() {
    return LetterGroups.map((group, i) => {
      return (
        <div key={i}>
          <span>{group.title}</span>
        </div>
      )
    });
  }

  render() {
    return (
      <main className="app-content home-page">
        <div className="project-background" style={{ height: this.state.backgroundHeight }} />
        <div className="home-page__content">
          <h1 className="main-title">Anti-Slavery Manuscripts</h1>
          <h1 className="secondary-head">Presented <i className="secondary-conjunctions">by the</i> Boston Public Library</h1>
          <img role="presentation" className="divider" src={Divider} />
          <div className="home-page__body-text">
            <b className="body-copy-first-word">Welcome</b> to Anti-Slavery Manuscripts. Now let&apos;s drop some
            of that phat Lorem ipsum beat. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec eget eleifend risus, id aliquet est. Maecenas
            tempus luctus lacinia.
          </div>
          <h3 className="transcribe">Transcribe Random&#8608;</h3>
          <span className="instructions">
            Click the button above to start with a random document, or choose a topic:
          </span>
          <div className="home-page__topic-select flex-row">
            {this.renderTopics()}
          </div>
        </div>
        <div id="home-logos" className="home-page__logos flex-row">
          <a href="https://www.zooniverse.org">
            <ZooniverseLogotype />
          </a>
          <a href="https://www.bpl.org">
            <img role="presentation" src={BostonLogo} />
          </a>
        </div>
        <SocialSection />
        <div className="home-page__community">
        </div>
        <div className="home-page__zooniverse">
          <ZooniverseLogo className="zooniverse-logo" height="3.5em" width="3.5em" />
          <span>
            The Zooniverse is the world&#39;s largest and most popular platform
            for people-powered research. This research is made possible by
            hundreds of thousands of volunteers around the world. Zooniverse research
            results in new discoveries, datasets useful to the wider research community,
            and many publications.
          </span>
          <a href="https://www.zooniverse.org">zooniverse.org</a>
        </div>
      </main>
    );
  }
}

export default Home;
