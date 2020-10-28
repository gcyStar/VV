/**
 * Created by chunyang.gao on 17/4/11.
 */
var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
        'VV':'./test/entry.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // publicPath: '/dist/',
        filename: '[name].build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: [ '.js', '.vue']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    // devtool: '#eval-source-map'
}

