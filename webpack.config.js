var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var nodePath = path.resolve(__dirname, "node_modules");
var distPath = path.resolve(__dirname, "static/dist");
var jsPath = path.resolve(__dirname, "static/javascripts");

module.exports = {

    entry: {
        index : path.join(jsPath, "main.jsx"),
        success : path.join(jsPath, "success.jsx"),
    },

    output: {
        path: distPath,
        filename: "[name].js",
        sourceMapFilename: "[file].map",
        publicPath: distPath
    },

    resolve: {
        extensions: ["", ".js", ".jsx", ".json", ".coffee", ".css", ".scss"]
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {stage: 0}
            },
            {
                test: /\.html$/,
            loader: "file?name=[name].[ext]"
            },
            {
                test: /\.(woff2|woff|ttf|eot)$/,
                loader: "file?name=fonts/[name].[ext]"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'css-loader?sourceMap!sass-loader?sourceMap=true&sourceMapContents=true'
                )
            },
            {
                test: /\.(png|jpg|svg|ico)$/,
                loader: "file-loader?name=[path][name].[ext]"
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("[name].css"),
    ],

    devtool: "source-map"
}
