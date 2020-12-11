/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm, isValidLibName } = require("../util/utils");
const print = require("../util/print");
const _ = require("lodash");
const { generateWebpackConfig } = require("../webpack/config");
const { generateWebpackLibConfig } = require("../webpack/libconfig");
const { loadHoneyConfig } = require("../util/config");
const webpack = require("webpack");
const { cdnCmd } = require("./cdn_cmd");

function asyncWebpackBuild(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
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
      resolve();
    });
  });
}

async function buildCmd() {
  try {
    await doCmd("npm", ["i", "--save", "core-js@3"]);
    await doCmd("npm", ["i", "--save", "regenerator-runtime"]);
    await doCmd("npm", ["i"]);
  } catch (err) {
    print.error(err);
  }

  const config = loadHoneyConfig();

  try {
    await rm(config.dist);
    let webpackConfig = null;
    //build
    if (config.isLib) {
      // check lib option
      if (!config.libName) {
        print.error("请在package.json的honeyConfig里配置libName");
        return;
      }
      if (!isValidLibName(config.libName)) {
        print.error("libName必须遵循蛇形命名");
        return;
      }
      if (!config.umdName) {
        config.umdName = _.camelCase(config.libName);
      }
      webpackConfig = generateWebpackLibConfig(config);
    } else {
      webpackConfig = generateWebpackConfig(config);
    }

    await asyncWebpackBuild(webpackConfig);

    if (config.cdn) {
      await cdnCmd();
    }
  } catch (err) {
    print.error(err);
  }
}

module.exports = {
  buildCmd,
};
