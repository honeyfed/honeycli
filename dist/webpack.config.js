const nodeExternals =require('webpack-node-externals')
const path= require('path')

module.exports = {
  target: 'node',
  externals: [nodeExternals({
    modulesDir: path.resolve(__dirname, '../node_modules')
  })],
  entry: '../src/index.js',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              'targets': {
                'node': 'current'
              }
            }]
          ]
        }
      }
    }]
  },
  node: {
    __dirname: false
  }
}
