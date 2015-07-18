var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./js/app.js",
    module: {
        loaders: [
            { 
                test: /\.js$/, 
                loader: 'babel', 
                exclude: /node_modules/ 
            },
            {   
                test: /\.css$/, 
                loader: ExtractTextPlugin.extract('style-loader', "css-loader") 
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("build/styles.min.css", { allChunks: true })
    ],
    output: {
        filename: "build/bundle.js"
    }
};
