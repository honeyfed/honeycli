/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { loadJson, doCmd } = require("../util/utils");
const print = require("../util/print");
const _ = require("lodash");
const rmcb = require("rimraf");
const util = require("util");
const path = require("path");
const { generateWebpackConfig } = require("../webpack/tool");
const webpack = require("webpack");

const rm = util.promisify(rmcb);

const defaultConfig = {
  src: "./src",
  dist: "./dist",
  entry: "index.js",
  template: "index.html",
  static: './static'
};

async function buildCmd() {

  try {
    await doCmd('npm i --save core-js@3')
    await doCmd('npm i')
  } catch (err) {
    print.error(err)
  }

  const packageJson = loadJson("./package.json");

  const config = {};
  _.merge(config, defaultConfig);
  if (packageJson && packageJson.honeyConfig) {
    // console.log(packageJson.honeyConfig)

    _.merge(config, packageJson.honeyConfig);
  } else {
    print.info("no config found");
  }
  config.src = path.resolve(process.cwd(), config.src);
  config.dist = path.resolve(process.cwd(), config.dist);

  try {
    await rm(config.dist);
    //build
    const webpackConfig = generateWebpackConfig(config);
    webpack(webpackConfig, (err, stats) => {
      if (err) throw err;
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
          chunks: false,
          chunkModules: false,
        }) + "\n\n"
      );

      if (stats.hasErrors()) {
        print.error("  Build failed with errors.\n");
        process.exit(1);
      }

      print.info("  Build complete.\n");
    });
  } catch (err) {
    print.error(err);
  }
}

module.exports = {
  buildCmd,
};
