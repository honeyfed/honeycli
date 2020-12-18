const net = require("./net");
const { loadJson } = require("./utils");
const path = require("path");
const _ = require("lodash");
const print= require('./print')
function loadProjectConfig() {}

async function loadTemplates() {
  try {
    const data = await net.get(
      "https://raw.githubusercontent.com/honeyfed/config/master/templates.json"
    );
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error(err);
  }
  return null;
}

const defaultConfig = {
  src: "./src",
  dist: "./dist",
  entry: "index.js",
  template: "index.html",
  static: "",
  isLib: false,
  dev: {
    port: 8080,
    proxy: [],
    mock: "",
  },
};

function loadHoneyConfig() {
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
  if (config.static) {
    config.static = path.resolve(process.cwd(), config.static);
  }

  if (packageJson.name) {
    config.packageName = packageJson.name
  }
  return config;
}

module.exports = {
  loadTemplates,
  loadHoneyConfig,
};
