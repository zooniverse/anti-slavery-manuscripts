import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import oauth from 'panoptes-client/lib/oauth';

import { config } from './constants/config';
import configureStore from './store';

import App from './components/App';
import HomePage from './components/Home-Page/index.jsx';
import PoweredBy from './components/Powered-by';
import About from './components/About';

// Todo: let's find a better way to include Styles,
// currently Styles looks like an unused var to eslint
import Styles from './styles/main.styl'; // eslint-disable-line no-unused-vars

const store = configureStore();

window.React = React;

oauth.init(config.panoptesAppId)
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="/about" component={About} />
            <Route path="/poweredby" component={PoweredBy} />
          </Route>
        </Router>
      </Provider>),
      document.getElementById('root'),
    );
  });
