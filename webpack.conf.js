'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    resolve: {
        modules: [process.env.NODE_PATH],
        extensions: ['.json', '.jsx', '.js']
    },
    resolveLoader: {
        modules: [process.env.NODE_PATH],
        extensions: ['.js']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            }
        }, {
            test: /\.json?$/,
            loader: 'json-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader'
        }]
    }
}

var mainConfig = Object.assign({}, config, {
    devtool: 'eval-source-map',
    entry: ['babel-polyfill', path.join(__dirname, 'src/client/index.js')],
    output: {
        path: path.join(__dirname, 'src/client/dist'),
        filename: 'bundle.js',
        publicPath: 'static/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/client/index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ]
});

var librariesConfig = Object.assign({}, config, {
    entry: {
        'connect-supplier-widget': path.join(__dirname, 'src/client/components/ConnectSupplierWidget.js')
    },
    output: {
        path: path.join(__dirname, 'src/client/dist'),
        publicPath: '/static',
        filename: 'components/[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
});

module.exports = [mainConfig, librariesConfig];
