/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm, writeFile } = require("../util/utils");
const print = require("../util/print");
const { getEslintrc } = require("../lint/lint");
const { getPrettierrc } = require("../format/rc");
const path = require("path");
const { generateWebpackConfig } = require("../webpack/config");
const { loadHoneyConfig } = require("../util/config");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

async function devCmd() {
  try {
    await doCmd("npm", ["i", "--save", "core-js@3"]);
    await doCmd("npm", ["i", "--save", "regenerator-runtime"]);
    await doCmd("npm", [
      "i",
      "--save-dev",
      "--force",
      "eslint",
      "eslint-plugin-vue",
      "eslint-plugin-react",
      "eslint-config-tencent",
    ]);
    await doCmd("npm", ["i"]);
    await rm(path.resolve(process.cwd(), ".eslintrc.js"));
    await rm(path.resolve(process.cwd(), ".eslintrc.json"));
    await rm(path.resolve(process.cwd(), ".eslintrc"));
    await rm(path.resolve(process.cwd(), ".prettierrc"));
    writeFile(path.resolve(process.cwd(), ".eslintrc.js"), getEslintrc());
    writeFile(
      path.resolve(process.cwd(), ".prettierrc"),
      JSON.stringify(getPrettierrc())
    );
  } catch (err) {
    print.error(err);
  }

  const config = loadHoneyConfig();

  try {
    //build
    const webpackConfig = generateWebpackConfig(config, "development");
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
