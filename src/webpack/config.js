const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackUtil = require('./util')
// const UploadCdnPlugin = require('./uploadcdn.js')
const { generateBasicWebpackConfig } = require("./baseconfig");
const print = require('../util/print')
function proxyConfigToDevServer(honeyConfig) {
  const proxyConfig = honeyConfig.dev.proxy;
  const devProxyConfig = {};
  if (Array.isArray(proxyConfig) && proxyConfig.length) {
    proxyConfig.forEach((config) => {
      if (config.from && config.to) {
        devProxyConfig[config.from] = {
          target: config.to,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
        };
        if (honeyConfig.dev.mock) {
          const mockfile = path.resolve(
            process.cwd(),
            honeyConfig.dev.mock
          )
          delete __non_webpack_require__.cache[__non_webpack_require__.resolve(mockfile)]
          try {
            const mockFunction = __non_webpack_require__(mockfile);
            devProxyConfig[config.from].bypass = mockFunction;
          } catch (err) {
            print.error(err && err.message)
            print.error('mock文件加载错误')
          }

        }
      }
    });
  }
  return devProxyConfig;
}

function generateWebpackConfig(config, mode = "production") {
  const webpackConfig = generateBasicWebpackConfig(config, mode);
  webpackConfig.output = {
    path: config.appPath? path.resolve(config.dist, webpackUtil.urlToRelatedDir(config.appPath)): config.dist,
    filename: mode === "production" ? "js/[name].[hash:6].js" : "js/[name].js",
    publicPath: config.appPath ? webpackUtil.fixUrlSuffix(config.appPath) : "/",
  };
  if(config.isQianKun){
    webpackConfig.output.library = config.umdName
    webpackConfig.output.libraryTarget = "umd"
    webpackConfig.output.jsonpFunction = config.jsonpFunction ? config.jsonpFunction : null
  }
  webpackConfig.optimization = {
    splitChunks: {
      chunks: "all",
    },
  };

  webpackConfig.devServer = {
    port: config.port,
    hot: true,
    publicPath: config.appPath ? webpackUtil.fixUrlSuffix(config.appPath) : "/",
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: webpackUtil.fixUrlSuffix(config.appPath || '/')+"index.html" }],
    },
    proxy: proxyConfigToDevServer(config),
    headers: config.headers ? config.headers : {}
  };
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(config.src, config.template),
    })
  );

  if (config.static) {
    webpackConfig.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: config.static,
            to: config.dist,
          },
        ],
      })
    );
  }

  if (config.appPath) {
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        APPPATH: JSON.stringify(config.appPath)
      })
    )
  }
  return webpackConfig;
}
module.exports = {
  generateWebpackConfig,
};
