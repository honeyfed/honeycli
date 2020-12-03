/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm } = require("../util/utils");
const print = require("../util/print");

const { generateWebpackConfig } = require("../webpack/config");
const { loadHoneyConfig } = require("../util/config");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

async function devCmd() {
  try {
    await doCmd("npm i --save core-js@3");
    await doCmd("npm i");
  } catch (err) {
    print.error(err);
  }

  const config = loadHoneyConfig();

  try {
    //build
    const webpackConfig = generateWebpackConfig(config, 'development');
    const server = new webpackDevServer(
      webpack(webpackConfig),
      webpackConfig.devServer
    );
    server.listen(config.dev.port, "0.0.0.0", () => {
      print.info(`Starting server on http://localhost:${config.dev.port}`);
    });
  } catch (err) {
    print.error(err);
  }
}

module.exports = {
  devCmd,
};
