const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// const UploadCdnPlugin = require('./uploadcdn.js')


function generateWebpackConfig(config, mode="production") {
  const webpackConfig =  {
    mode,
    entry: path.resolve(config.src, config.entry),
    output: {
      path: config.dist,
      filename: 'app.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': config.src
      }
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '../../node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            cwd: path.resolve(__dirname, '../../'),
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage', 
                  corejs: 3,
                  targets: '> 0.25%, not dead'
                }
              ]
            ],
          },
          exclude: /node_modules/
        }, {
          test: /\.vue$/,
          loader: 'vue-loader'
        }, {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        }, {
          test: /\.(ttf|woff|gif|png|jpg|jpeg|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8092,
                esModule: false
              }
            }
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: 'eval-source-map',
    devServer: {
      port: 8082,
      hot: true,
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: '/index.html' },
        ],
      },
      proxy: {
        '/access': {
          target: 'https://wy-test.haina.com',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
          bypass: function (req, res) {
            console.log('req.path: ', req.path)
            if (req.path === '/access/timestamp') {
              res.send('' + Date.now())
              return false
            }
          }
        }
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(config.src, config.template)
      }),
      // new UploadCdnPlugin(),
      new ProgressBarPlugin()
    ]
  } 
  return webpackConfig
}
module.exports = {
  generateWebpackConfig
}