"use strict";

let prod = process.env.NODE_ENV === "production";
let webpack = require('webpack');
let path = require('path');

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
        ]
    },
    output: {
        path: __dirname + "/src/",
        filename: "index.min.js"
    },
    plugins: !prod ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};