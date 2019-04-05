/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true  }] */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const nib = require('nib');

module.exports = {
  mode: 'development',
  devServer: {
    allowedHosts: [
      '.zooniverse.org',
    ],
    historyApiFallback: true,
    contentBase: path.join(__dirname, '/src/'),
    open: true,
    inline: true,
    port: 3000, // Change this for your project
  },
  devtool: 'cheap-module-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    path.join(__dirname, 'src/index.jsx'),
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      gtm: '',
    }),
    new DashboardPlugin({ port: 3001 }),
  ],

  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl', '.css'],
    modules: ['.', 'node_modules'],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      use: 'file-loader',
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }],
    }, {
      test: /\.styl$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'stylus-loader',
        options: {
          use: [nib()],
        },
      }],
    }, {
      test: /\.(txt|ico)$/,
      use: [{
        loader: 'file-loader?name=[name].[ext]',
      }],
    }],
  },
  node: {
    fs: 'empty',
  },

};
