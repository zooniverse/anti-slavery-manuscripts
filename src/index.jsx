import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import oauth from 'panoptes-client/lib/oauth';

import App from './components/App';
import Home from './components/Home';
import AboutTheCollection from './components/AboutTheCollection';
import AboutTheProject from './components/AboutTheProject';
import Classifier from './containers/ClassifierContainer';
import { config } from './config';
import configureStore from './store';

// Todo: let's find a better way to include Styles,
// currently Styles looks like an unused var to eslint
import Styles from './styles/main.styl'; // eslint-disable-line no-unused-vars
import favicon from './images/favicon.ico';
import socialMediaPreview from './images/social-media-preview.jpeg';

const store = configureStore();

oauth.init(config.panoptesAppId)
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/classify" component={Classifier} />
            <Route path="/about" component={AboutTheCollection} />
            <Route path="/about-the-project" component={AboutTheProject} />
            <Route path="*" component={null} />
          </Route>
        </Router>
      </Provider>),
      document.getElementById('root'),
    );
  });
