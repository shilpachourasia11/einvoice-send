const path = require('path');
const webpack = require('webpack');
const Config = require('webpack-config').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = new Config().merge({
  entry: {
      main: ['babel-polyfill', './src/client/index.js']
  },


  // exclude empty dependencies, require for Joi
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },

  externals: {
    "jquery": "jQuery"
  },

  resolve: {
    modules: [`${process.env.NODE_PATH}`, 'node_modules']
  },

  resolveLoader: {
    modules: [`${process.env.NODE_PATH}`, 'node_modules']
  },

  plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        jquery:"jquery"
      })
  ],

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src/client')
        ],
        exclude: [`${process.env.NODE_PATH}`],
        options: {
          compact: false,
          babelrc: false,
          presets: [
            ['es2015', {modules: false}],
            'react',
            'stage-0'
          ]
        }
      }
    ]
  }
});
