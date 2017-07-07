import React from 'react';
import { ZooniverseLogotype, ZooniverseLogo } from 'zooniverse-react-components';
import Divider from '../images/img_divider.png';

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

  renderTopic() {
    const numbers = ['One', 'Two', 'Three', 'Four'];
    return numbers.map((num, i) => {
      return <div key={i}>Topic {num} &#8608;</div>;
    });
  }

  render() {
    return (
      <main className="app-content home-page">
        <div className="project-background" style={{ height: this.state.backgroundHeight }}></div>
        <div className="home-page__content">
          <h1 className="title-header">Anti-Slavery Manuscripts</h1>
          <img role="presentation" className="home-page__divider" src={Divider} />
          <div className="home-page__body-text">
            <b>Welcome to Liberating the Liberator.</b> Now let&apos;s drop some
            of that phat Lorem ipsum beat. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec eget eleifend risus, id aliquet est. Maecenas
            tempus luctus lacinia.
          </div>
          <h3>Transcribe Random&#8608;</h3>
          <span className="home-page__instructions">Click the button above to start with a random document, or choose a topic:</span>
          <div className="home-page__topic-select">
            {this.renderTopic()}
          </div>
        </div>
        <div id="home-logos" className="home-page__logos">
          <ZooniverseLogotype />
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div className="home-page__zooniverse">
          <ZooniverseLogo height="3.5em" width="3.5em" />
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
