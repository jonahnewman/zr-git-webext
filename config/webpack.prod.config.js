import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
// import ExtractTextPlugin from 'mini-css-extract-plugin'

import paths from './paths'

module.exports = {
  optimization: {
    minimize: true
  },
  mode: 'production',
  entry: {
    // In this boilerplate, we only enable the popup script for demo
    // You can still create your own background or content scripts under src folder
    // Then, add following config to entry
    // content: paths.contentSrc
    background: paths.backgroundSrc,
    popup: paths.popupSrc
  },
  output: {
    path: paths.prodBuild,
    pathinfo: true,
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js?$/,
      exclude: /node_modules/,
      include: [paths.source],
      loader: 'standard-loader'
    }, {
      test: /\.js?$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: [paths.source]
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
  plugins: [
    // new ExtractTextPlugin('css/style.css'),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.popupHtml,
      filename: 'popup.html',
      excludeChunks: ['content', 'background'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin({ patterns: [
      { from: paths.extension }
    ] })
  ]
}
