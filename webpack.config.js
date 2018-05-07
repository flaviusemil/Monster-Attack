var webpack = require('webpack');

var config = {
    context: __dirname + "/src",
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "postcss-loader",
                options: {
                    plugins: function() {
                        return [
                            require('precss'),
                            require('autoprefixer')
                        ];
                    }
                }
            }, {
                loader: "sass-loader"
            }]
        }]
    },
    entry: ['./js/main.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
};

module.exports = config;