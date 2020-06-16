/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true  }] */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniSccExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');

module.exports = {
  entry: [
    path.join(__dirname, 'src/index.jsx'),
  ],
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'main',
          test: /\.(css|styl)$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[chunkhash].min.js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      gtm: '<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-WDW6V4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-WDW6V4");</script>',
    }),
    new MiniSccExtractPlugin({
      filename: '[name]-[contenthash].css'
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
      use: [{
        loader: MiniSccExtractPlugin.loader,
      }, {
        loader: 'css-loader',
      }, {
        loader: 'stylus-loader',
        options: {
          use: [nib()],
        },
      }],
    }, {
      test: /social\-media\-preview\.jpeg/,  /* Use .jpeg so it doesn't trigger the .jpg processing rule too. */
      use: [{
        loader: 'file-loader?name=[name].[ext]',
      }],
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
