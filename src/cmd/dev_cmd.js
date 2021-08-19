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
const chokidar = require('chokidar')
const _ = require('lodash')

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

  print.info('begin build');
  const config = loadHoneyConfig();
  let server = await webpackDev(config)
  if (config.dev && config.dev.mock) {
    const mockfile = path.resolve(process.cwd(), config.dev.mock)

    chokidar.watch(mockfile).on('change', _.throttle(() => {
      const tmpServer = server
      server = null
      tmpServer && tmpServer.close(async ()=>{
        server = await webpackDev(config)
      })
    }, 2000, {leading: true, trailing: false}))
  }
}

function webpackDev(config) {
  return new Promise(resolve=>{
    try {
      //build
      const webpackConfig = generateWebpackConfig(config, "development");
      const server = new webpackDevServer(
        webpack(webpackConfig),
        webpackConfig.devServer
      );
      server.listen(config.dev.port, "0.0.0.0", () => {
        print.info(`Starting server on http://localhost:${config.dev.port}`);
        resolve(server);
      });
    } catch (err) {
      print.error('server'+err);
      resolve(null);
    }
  })

}

module.exports = {
  devCmd,
};
