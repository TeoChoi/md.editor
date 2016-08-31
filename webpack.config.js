var webpack = require("webpack");
var path = require("path");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin("global.js");

module.exports = {
    plugins: [commonsPlugin],// 打包公共代码
    //页面入口文件配置
    entry: {
        "global.js": ["jquery", "bootstrap"],
        "css/global.css": "./style.js",
        "index": "./index.js"
    }
    //入口文件输出配置
    ,
    output: {
        // path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: "../dist/"
    }
    ,
    module: {
        loaders: [
            {test: require.resolve("jquery"), loader: "expose?$!expose?jQuery"},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.js$/, loader: "babel", query: {presets: ['es2015']}, exclude: /(node_modules|bower_components)/},
            {test: /\.(png|jpg|eot|svg|ttf|woff|woff2)$/, loader: "url-loader?limit=8140"}
        ]
    }
    ,
    resolve: {
        alias: {
            "jquery.fileupload": path.resolve("./js/jquery.fileupload.js")
        }
    }
};