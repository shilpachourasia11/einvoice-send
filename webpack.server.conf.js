'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
    name: 'clinet-App for SSR',
    devtool : 'eval-source-map',
    entry : path.join(__dirname, 'src/client/app/App.js'),
    output : {
        path : path.join(__dirname, 'src/client/dist'),
        filename : 'App.js',
        publicPath : '/static'
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        })
    ],
    resolve: {
        modules: [process.env.NODE_PATH],
        extensions: ['.json', '.jsx', '.js']
      },
    resolveLoader: {
        modules: [process.env.NODE_PATH],
        extensions: ['.js']
    },
    module : {
        loaders : [{
            test : /\.jsx?$/,
            exclude : /node_modules/,
            loader : 'babel-loader',
            query: {
                presets : ['react', 'es2015', 'stage-0']
            }
        }, {
            test : /\.json?$/,
            loader : 'json-loader'
        }, {
            test : /\.css$/,
            loader : 'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
        }]
    }
};
