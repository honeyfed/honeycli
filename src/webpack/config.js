const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const UploadCdnPlugin = require('./uploadcdn.js')

function proxyConfigToDevServer(honeyConfig) {
  const proxyConfig = honeyConfig.dev.proxy
  const devProxyConfig = {}
  if (Array.isArray(proxyConfig) && proxyConfig.length) {
    proxyConfig.forEach(config => {
      if (config.from && config.to) {
        devProxyConfig[config.from] = {
          target: config.to,
          changeOrigin: true,
          cookieDomainRewrite: "localhost"
        }
        if (honeyConfig.dev.mock) {
          const mockFunction = require(path.resolve(process.cwd(), honeyConfig.dev.mock))
          devProxyConfig[config.from].bypass = mockFunction
        }
      }
    })
  }
  return devProxyConfig
}


function generateWebpackConfig(config, mode = "production") {
  const webpackConfig = {
    mode,
    entry: path.resolve(config.src, config.entry),
    output: {
      path: config.dist,
      filename: mode === 'production' ? "[name].[hash:6].js" : "[name].js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        "@": config.src,
      },
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, "../../node_modules")],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            cwd: path.resolve(__dirname, "../../"),
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: "> 0.25%, not dead",
                },
              ],
            ],
          },
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.(ttf|woff)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: mode === "production" ? "fonts/[name]-[hash:6].[ext]" : "fonts/[name].[ext]",
                limit: 8092,
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpg|jpeg|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: mode==="production" ? "imgs/[name]-[hash:6].[ext]" : "imgs/[name].[ext]",
                limit: 8092,
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    devtool: mode === "production" ? "none" : "eval-source-map",
    devServer: {
      port: config.port,
      hot: true,
      historyApiFallback: {
        rewrites: [{ from: /.*/, to: "/index.html" }],
      },
      proxy: proxyConfigToDevServer(config),
    },
    plugins: [
      new VueLoaderPlugin(),

      new HtmlWebpackPlugin({
        template: path.resolve(config.src, config.template),
      }),
      // new UploadCdnPlugin(),
      new ProgressBarPlugin(),
    ],
  };
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
