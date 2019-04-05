/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true  }] */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const nib = require('nib');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniSccExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

  entry: [
    path.join(__dirname, 'src/index.jsx'),
  ],

  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[hash].min.js',
  },

  mode: 'production',

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      gtm: '<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-WDW6V4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-WDW6V4");</script>',
    }),
    new MiniSccExtractPlugin({
      filename: '[name]-[contenthash].css'
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl', '.css'],
    modules: ['.', 'node_modules'],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!(markdown-it-anchor|markdown-it-table-of-contents|striptags)\/).*/,
      use: 'babel-loader',
    }, {
      test: /\.css$/,
      use: [
        MiniSccExtractPlugin.loader,
        'css-loader',
      ],
    }, {
      test: /\.styl$/,
      use: [
        MiniSccExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
             includePaths: [path.resolve(__dirname, 'node_modules/zoo-grommet/dist'), path.resolve(__dirname, 'node_modules/zooniverse-react-components/lib/zooniverse-react-components.css')]
          },
        }, {
          loader: 'stylus-loader',
          options: {
            use: [nib()],
          },
        },
      ],
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      use: [{
        loader: 'file-loader',
      }, {
        loader: 'image-webpack-loader',
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
