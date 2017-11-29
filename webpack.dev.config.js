const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const buildConfig = require('./build/config');
var len = webpackBaseConfig.template.length;
var plugins = [
    new ExtractTextPlugin({
        filename: buildConfig.stylesPath + '/[name].css'
    }),
    new webpack
        .optimize
        .CommonsChunkPlugin({
            names: ["common", "vendors"]
        })
];
for (var i = 0; i < len; i++) {
    plugins.push(new HtmlWebpackPlugin(webpackBaseConfig.template[i]));
}
module.exports = merge(webpackBaseConfig.webpack, {
    devtool: '#source-map',
    output: {
        filename: buildConfig.scriptsPath + '/[name].js',
        chunkFilename: buildConfig.scriptsPath + '/[name].chunk.js'
    },
    plugins: plugins,
    //添加此配置才可以使用域名代理
    devServer: {
        disableHostCheck: true
    }
});