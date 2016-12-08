"use strict";

let prod = process.env.NODE_ENV === "production";
let webpack = require('webpack');
let path = require('path');
let copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: 'cheap-module-source-map',
    entry: './index.js',
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy', 'syntax-async-functions'],
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy', 'syntax-async-functions'],
                }
            },
            {
                test: /\.css$/,
                loaders: ['raw-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    output: {
        path: __dirname + "/build/",
        filename: "index.min.js"
    },
    plugins: !prod ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
        new copyWebpackPlugin([
            {from: __dirname + '/src/assets', to: __dirname + '/build/assets'},
            {from: __dirname + '/src/css', to: __dirname + '/build/css'},
            {from: __dirname + '/src/index.html', to: __dirname + '/build/index.html'}
        ]),
    ],
};