const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const UploadCdnPlugin = require('./uploadcdn.js')
const { generateBasicWebpackConfig } = require("./baseconfig");

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
          const mockFunction = require(path.resolve(
            process.cwd(),
            honeyConfig.dev.mock
          ));
          devProxyConfig[config.from].bypass = mockFunction;
        }
      }
    });
  }
  return devProxyConfig;
}

function generateWebpackConfig(config, mode = "production") {
  const webpackConfig = generateBasicWebpackConfig(config, mode);
  webpackConfig.output = {
    path: config.dist,
    filename: mode === "production" ? "[name].[hash:6].js" : "[name].js",
    publicPath: "/",
  };
  webpackConfig.optimization = {
    splitChunks: {
      chunks: "all",
    },
  };

  webpackConfig.devServer = {
    port: config.port,
    hot: true,
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: "/index.html" }],
    },
    proxy: proxyConfigToDevServer(config),
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
  return webpackConfig;
}
module.exports = {
  generateWebpackConfig,
};
