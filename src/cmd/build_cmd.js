/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm } = require("../util/utils");
const print = require("../util/print");
const _ = require("lodash");
const { generateWebpackConfig } = require("../webpack/config");
const { loadHoneyConfig } = require("../util/config");
const webpack = require("webpack");

async function buildCmd() {
  try {
    await doCmd("npm i --save core-js@3");
    await doCmd("npm i");
  } catch (err) {
    print.error(err);
  }

  const config = loadHoneyConfig();

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
