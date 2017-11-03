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
    panoptesAppId: '974cc8da2448bac692703f0b364a6b41a7662d91a5a3a1acb064eb703a01e6df', // ASM on Staging
    zooniverseLinks: {
      host: 'https://master.pfe-preview.zooniverse.org/',
      caesarHost: 'https://caesar-staging.zooniverse.org/graphql',
      projectId: '1764',
      projectSlug: 'wgranger-test/anti-slavery-testing',
      workflowId: '3017'
    },
  },
  production: {
    panoptesAppId: '064a5a32a9d2d389eeb876a8b7cb0fbe596fd80d7a040566f14965446d34c541',  //Anti-Slavery Manuscripts
    zooniverseLinks: {
      host: 'https://www.zooniverse.org/',
      caesarHost: 'https://caesar.zooniverse.org/graphql',
      projectId: '4973',
      projectSlug: 'bostonpubliclibrary/anti-slavery-manuscripts',
      workflowId: '5329'
    },
  }
};

const baseSubjectSets = {
  development: [
    { title: '1800-1839', id: '4420' },
    { title: '1840-1849', id: '4422' },
    { title: '1850-1859', id: '4423' },
    { title: '1860-1869', id: '4424' },
    { title: '1870-1900', id: '4425' }
  ],
  production: [
    { title: '1800-1839', id: '15582' },
    { title: '1840-1849', id: '15583' },
    { title: '1850-1859', id: '15584' },
    { title: '1860-1869', id: '15585' },
    { title: '1870-1900', id: '15526' }
  ]
};


baseConfig.staging = baseConfig.development;  //staging === development, as far as we're concerned.
baseSubjectSets.staging = baseSubjectSets.development;

const config = baseConfig[env];
const subjectSets = baseSubjectSets[env];

export { env, config, CONSENSUS_SCORE, subjectSets };

// Try and match the location.search property against a regex. Basically mimics
// the CoffeeScript existential operator, in case we're not in a browser.
function locationMatch(regex) {
  var match;
  if (typeof location !== 'undefined' && location !== null) {
    match = location.search.match(regex);
  }
  return (match && match[1]) ? match[1] : undefined;
}
