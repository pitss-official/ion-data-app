const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    target: 'node',
    mode: 'development',
    plugins: [
        new webpack.ProgressPlugin(),
    ],
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: path.resolve(__dirname, "node_modules"), // files to be ignored
                loader: 'babel-loader'
              }
        ]
    }
}
