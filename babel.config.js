module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    env: {
      development: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties',
          ],
          [
            '@babel/plugin-proposal-object-rest-spread',
          ],
          [
            '@babel/plugin-transform-react-jsx',
          ],
        ],
      },
      staging: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties',
          ],
          [
            '@babel/plugin-proposal-object-rest-spread',
          ],
          [
            '@babel/plugin-transform-react-jsx',
          ],
        ],
      },
      production: {
        plugins: [
          [
            '@babel/plugin-proposal-class-properties',
          ],
          [
            '@babel/plugin-proposal-object-rest-spread',
          ],
          [
            '@babel/plugin-transform-react-jsx',
          ],
        ],
      },
      test: {
        plugins: [
          [
            'babel-plugin-rewire',
          ],
          [
            '@babel/plugin-proposal-class-properties',
          ],
          [
            '@babel/plugin-proposal-object-rest-spread',
          ],
          [
            '@babel/plugin-transform-react-jsx',
          ],
        ],
      },
    },
  };
};
