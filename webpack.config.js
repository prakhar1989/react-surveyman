var webpack = require('webpack');

module.exports = {
    entry: "./js/app.js",
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    output: {
        filename: "build/bundle.js"
    }
};
