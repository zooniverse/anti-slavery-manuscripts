/*
Configuration Settings
----------------------

The config settings change depending on which environment the app is running in.
By default, this is the development environment, but this can be changed either by:

- An ?env query string, e.g. localhost:3000?env=production
- The NODE_ENV environment variable on the system running the app.

 */

var DEFAULT_ENV = 'development';
var CONSENSUS_SCORE = 3;
var envFromBrowser = locationMatch(/\W?env=(\w+)/);
var envFromShell = process.env.NODE_ENV;
var env = envFromBrowser || envFromShell || DEFAULT_ENV;

if (!env.match(/^(production|staging|development)$/)) {
  throw new Error(`Error: Invalid Environment - ${env}`);
}

const baseConfig = {
  development: {
    panoptesAppId: '24ad5676d5d25c6aa850dc5d5f63ec8c03dbc7ae113b6442b8571fce6c5b974c', // test-rog project for dev
    zooniverseLinks: {
      host: 'https://master.pfe-preview.zooniverse.org/',
      projectId: '1764',
      projectSlug: 'wgranger-test/anti-slavery-testing',
    },
  },
  production: {
    panoptesAppId: '064a5a32a9d2d389eeb876a8b7cb0fbe596fd80d7a040566f14965446d34c541',  //Anti-Slavery Manuscripts
    zooniverseLinks: {
      host: 'https://www.zooniverse.org/',
      projectId: '4973',
      projectSlug: 'bostonpubliclibrary/anti-slavery-manuscripts',
    },
  }
};
baseConfig.staging = baseConfig.development;  //staging === development, as far as we're concerned.

const config = baseConfig[env];
export { env, config, CONSENSUS_SCORE };

// Try and match the location.search property against a regex. Basically mimics
// the CoffeeScript existential operator, in case we're not in a browser.
function locationMatch(regex) {
  var match;
  if (typeof location !== 'undefined' && location !== null) {
    match = location.search.match(regex);
  }
  return (match && match[1]) ? match[1] : undefined;
}
