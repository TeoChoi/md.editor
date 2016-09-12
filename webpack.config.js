var webpack = require("webpack");
var path = require("path");
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin("global.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
    //页面入口文件配置
    , entry: {
        "index": "./index.js"
        , "preview": "./preview.js"
        ,"css/editor": "./src/less/editor.less"
        ,"css/preview": "./src/less/preview.less"
    }
    //入口文件输出配置
    , output: {
        path: path.resolve("dist")
        , filename: "[name].js"
        , publicPath: "/dist/"
    }
    , watch: true
    , module: {
        loaders: [
            {test: require.resolve("jquery"), loader: "expose?$!expose?jQuery"},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
            {test: /\.js$/, loader: "babel", query: {presets: ['es2015']}, exclude: /(node_modules|bower_components)/},
            {test: /\.(png|jpg|eot|svg|ttf|woff|woff2)$/, loader: "url-loader?limit=8140"}
        ]
    }
    , resolve: {
        alias: {
            "jquery.fileupload": path.resolve("./src/js/jquery.fileupload.js")
        }
    }
    // , devtool: "source-map"
};