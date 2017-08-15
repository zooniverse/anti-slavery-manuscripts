/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true  }] */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nib = require('nib');

module.exports = {

  devtool: 'eval-source-map',

  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src/index.jsx'),
  ],

  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      gtm: '',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('staging'),
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.styl'],
    modules: ['.', 'node_modules'],
  },

  module: {
    // preLoaders: [
    //   {
    //     test: /\.jsx?$/,
    //     exclude: /node_modules/,
    //     loader: 'eslint-loader',
    //   },
    // ],
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: 'babel-loader',
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      use: 'file-loader',
    }, {
      test: /\.styl$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
           includePaths: [path.resolve(__dirname, 'node_modules/zoo-grommet/dist'), path.resolve(__dirname, 'node_modules/zooniverse-react-components/lib/zooniverse-react-components.css')]
        }
      }, {
        loader: 'stylus-loader',
        options: {
          use: [nib()],
        },
      }],
    }],
  },

};
