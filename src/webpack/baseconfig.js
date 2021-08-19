const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const { getEsLintOptions } = require("../lint/lint");
const {getPathInLib}=require('../dir')
const {browserslistrc} = require('../caniuse/browserslist')
function generateBasicWebpackConfig(config, mode = "production") {

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      // ident: 'postcss',
      postcssOptions: {
        plugins: [
          __non_webpack_require__('postcss-preset-env')({
            browsers: browserslistrc
          })
        ]
      }
    }
  }

  if (config.rem) {
    postCssLoader.options.postcssOptions.plugins.push(__non_webpack_require__('postcss-pxtorem')({
      rootValue: 100,
      unitPrecision: 8,
      propList: ['*']
    }))
  }


  const webpackConfig = {
    mode,
    entry: path.resolve(config.src, config.entry),
    resolve: {
      extensions: [".js", ".jsx", ".vue", ".json"],
      alias: {
        "@": config.src,
      },
    },
    resolveLoader: {
      modules: [getPathInLib("./node_modules")],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          options: {
            cwd: getPathInLib("./"),
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: browserslistrc,
                },
              ],
              "@babel/preset-react"
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
          use: ["style-loader", "css-loader", postCssLoader],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader",postCssLoader, "less-loader"],
        },
        {
          test: /\.(ttf|woff|eot)$/,
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
