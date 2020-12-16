const root = require('app-root-path').path;
const webpack = require('webpack');

// 這邊展示 所有 cross-env 的參數
console.log("NODE_ENV :", process.env.NODE_ENV)

let commitHash = ""
try {
    commitHash = require('child_process')
        .execSync('git rev-parse --short HEAD')
        .toString().replace('\n', '');
} catch (error) {

}


module.exports = {
    entry: `${root}/src/app.ts`,
    target: 'node',
    output: {
        filename: 'app.js', // output file
        path: `${root}/dist`,
        libraryTarget: "commonjs"
    },
    resolve: {
        // Add in `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [
            `${root}/node_modules`,
            'node_modules'
        ]
    },
    resolveLoader: {
        //root: [`${root}/node_modules`],
    },
    module: {
        rules: [{
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
            }]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'env': JSON.stringify(process.env.NODE_ENV),
            'git_hash': JSON.stringify(commitHash),
        })
    ]
};

// 教學
// https://pjchender.github.io/2018/05/17/webpack-學習筆記（webpack-note）/