var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = [ new ExtractTextPlugin("build/styles.min.css", { allChunks: true }) ];

if (process.env.NODE_ENV === "production") {
    plugins.push( new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}) );
}

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
    plugins: plugins,
    output: {
        filename: "build/bundle.js"
    }
};
