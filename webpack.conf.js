'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool : 'eval-source-map',
    entry : path.join(__dirname, 'src/client/index.js'),
    output : {
        path : path.join(__dirname, 'src/client/dist'),
        filename : 'bundle.js',
        publicPath : '/static'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template : 'src/client/index.html',
            inject : 'body',
            filename : 'index.html'
        })
    ],
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
