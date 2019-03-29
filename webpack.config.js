/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true  }] */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const nib = require('nib');

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '/src/'),
    disableHostCheck: true,  //Enable localhost access on VMs, i.e. for our IE11 testing
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    port: 3000 // Change this for your project
  },
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'react-hot-loader/patch',
    path.join(__dirname, 'src/index.jsx'),
  ],

  mode: 'production',

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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('staging'),
    }),
    new DashboardPlugin({ port: 3001 })
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
    }, {
      test: /\.(txt|ico)$/,
      use: [{
        loader: 'file-loader?name=[name].[ext]',
      }],
    }],
  },
  node: {
    fs: 'empty'
  }

};
