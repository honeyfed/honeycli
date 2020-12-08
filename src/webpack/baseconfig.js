const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const { getEsLintOptions } = require("../lint/lint");

function generateBasicWebpackConfig(config, mode = "production") {
  const webpackConfig = {
    mode,
    entry: path.resolve(config.src, config.entry),
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
                name:
                  mode === "production"
                    ? "fonts/[name]-[hash:6].[ext]"
                    : "fonts/[name].[ext]",
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
                name:
                  mode === "production"
                    ? "imgs/[name]-[hash:6].[ext]"
                    : "imgs/[name].[ext]",
                limit: 8092,
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    devtool: mode === "production" ? "none" : "eval-source-map",
    plugins: [
      new VueLoaderPlugin(),
      new ProgressBarPlugin(),
      new EslintWebpackPlugin(getEsLintOptions()),
    ],
  };
  return webpackConfig;
}
module.exports = {
  generateBasicWebpackConfig,
};
