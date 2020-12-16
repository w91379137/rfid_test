const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    externals: [
        /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    watch: true,
    devtool: 'source-map',
})