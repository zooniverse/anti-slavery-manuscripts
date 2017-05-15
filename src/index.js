import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import oauth from 'panoptes-client/lib/oauth';

import App from './components/App';
import PoweredBy from './components/Powered-by';
import About from './components/About';
import { config } from './constants/config';
import configureStore from './store';

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
            <Route path="/about" component={About} />
            <Route path="/poweredby" component={PoweredBy} />
          </Route>
        </Router>
      </Provider>),
      document.getElementById('root'),
    );
  });
