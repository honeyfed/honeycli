const net = require('./net');
const { loadJson } = require('./utils');
const path = require('path');
const _ = require('lodash');
const print = require('./print');
const { defineConfig } = require('vite');
// const vue3Plugin = require('@vitejs/plugin-vue');
// const vueJsx = require('@vitejs/plugin-vue-jsx');
// const { createVuePlugin } = require('vite-plugin-vue2');
function loadProjectConfig() {}

async function loadTemplates() {
  try {
    const data = await net.get('https://raw.githubusercontent.com/honeyfed/config/master/templates.json');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error(err);
  }
  return null;
}

const defaultConfig = {
  src: './src',
  dist: './dist',
  entry: 'index.js',
  template: 'index.html',
  static: '',
  isLib: false,
  dev: {
    port: 8080,
    proxy: [],
    mock: '',
  },
};

function loadHoneyConfig() {
  const packageJson = loadJson('./package.json');

  const config = {};
  _.merge(config, defaultConfig);
  if (packageJson && packageJson.honeyConfig) {
    // console.log(packageJson.honeyConfig)

    _.merge(config, packageJson.honeyConfig);
  } else {
    print.info('no config found');
  }
  config.src = path.resolve(process.cwd(), config.src);
  config.dist = path.resolve(process.cwd(), config.dist);
  if (config.static) {
    config.static = path.resolve(process.cwd(), config.static);
  }

  if (packageJson.name) {
    config.packageName = packageJson.name;
  }
  return config;
}

function translateHoneyConfigToVite(honeyConfig, mode = 'development') {
  const config = {
    root: honeyConfig.src,
    resolve: {
      alias: {
        '@': honeyConfig.src,
      },
    },
  };
  if (honeyConfig.static) {
    config['publicDir'] = honeyConfig.static;
  }
  // if (honeyConfig.isReact) {
  //   // config['plugins'] = [];
  //   // } else if (honeyConfig.isVue3) {
  //   //   config['plugins'] = [vue3Plugin(), vueJsx()];
  // } else {
  //   config['plugins'] = [createVuePlugin()];
  // }

  // dev 模式配置
  if (mode === 'development') {
    // for dev
    config['server'] = {
      // 端口
      port: honeyConfig.dev.port,
    };
    // proxy 代理选项
    if (Array.isArray(honeyConfig.dev.proxy) && honeyConfig.dev.proxy.length > 0) {
      const proxyArr = honeyConfig.dev.proxy;
      const proxyConfig = {};
      proxyArr.forEach((proxyItem) => {
        proxyConfig[proxyItem.from] = {
          target: proxyItem.to,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        };
      });
      config['server']['proxy'] = proxyConfig;
    }
  }
  // 生产模式配置
  if (mode === 'production') {
    config['outDir'] = honeyConfig.dist;
  }

  return defineConfig(config);
}

module.exports = {
  loadTemplates,
  loadHoneyConfig,
  translateHoneyConfigToVite,
};
