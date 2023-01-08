import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import oauth from 'panoptes-client/lib/oauth';

import App from './components/App';
import { config } from './config';
import configureStore from './store';

// Todo: let's find a better way to include Styles,
// currently Styles looks like an unused var to eslint
import Styles from './styles/main.styl'; // eslint-disable-line no-unused-vars
import favicon from './images/favicon.ico';

const store = configureStore();
const history = createBrowserHistory();

oauth.init(config.panoptesAppId)
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={App} />
        </Router>
      </Provider>),
      document.getElementById('root'),
    );
  });
