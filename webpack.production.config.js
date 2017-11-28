const path = require('path');
const webpack = require('webpack');
const Config = require('webpack-config').default;
const Visualizer = require('webpack-visualizer-plugin');

module.exports = new Config().extend('webpack.base.config.js').merge({
  entry: {
    'connect-supplier-widget': path.join(__dirname, 'src/client/components/ConnectSupplierWidget.js')
  },
  output: {
    path: path.resolve(__dirname, 'src/server/static'),
    filename: 'bundle.js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "connect-supplier-widget",
      filename: "components/connect-supplier-widget.js",
      chunks: [
         "connect-supplier-widget"
      ],
      minChunks: function(module) {
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
  }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        drop_console: true,
        pure_getters: true,
        dead_code: true,
        screw_ie8: true
      }
  }),
    new Visualizer({filename: './statistics.html'})
  ]
});
