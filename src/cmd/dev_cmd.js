/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm, writeFile } = require('../util/utils');
const print = require('../util/print');
const { getEslintConfig } = require('../lint/lint');
const { getPrettierrc } = require('../format/rc');
const path = require('path');
const { generateWebpackConfig } = require('../webpack/config');
const { loadHoneyConfig, translateHoneyConfigToVite } = require('../util/config');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const { createServer } = require('vite');
const chokidar = require('chokidar');
const _ = require('lodash');

async function devCmd(cmd) {
  // 读取 package.json 中配置
  const config = loadHoneyConfig();
  const { useVite, isReact, isVue3 } = config;

  if (!cmd.fast) {
    try {
      await doCmd('npm', ['i', '--save', 'core-js@3']);
      await doCmd('npm', ['i', '--save', 'regenerator-runtime']);
      await doCmd('npm', [
        'i',
        '--save-dev',
        '--force',
        'eslint',
        'prettier',
        isVue3 ? 'eslint-plugin-vue@^8' : 'eslint-plugin-vue@^6',
        'eslint-plugin-react',
        'eslint-plugin-prettier@^3',
        'eslint-config-tencent',
      ]);
      await doCmd('npm', ['i']);
      if (useVite) {
        if (isReact) {
          // react
          await doCmd('npm', ['i', '@vitejs/plugin-react']);
        } else if (isVue3) {
          // vue3
          await doCmd('npm', ['i', '@vitejs/plugin-vue', '@vitejs/plugin-vue-jsx']);
        } else {
          // vue2
          await doCmd('npm', ['i', 'vite-plugin-vue2']);
        }
      }
      await rm(path.resolve(process.cwd(), '.eslintrc.js'));
      await rm(path.resolve(process.cwd(), '.eslintrc'));
      await rm(path.resolve(process.cwd(), '.eslintrc.json'));
      await rm(path.resolve(process.cwd(), '.eslint.honey.js'));
      await rm(path.resolve(process.cwd(), '.prettierrc'));
    } catch (err) {
      print.error(err);
    }
  }

  print.info('begin dev server');

  // 注入配置文件
  try {
    writeFile(
      path.resolve(process.cwd(), '.eslintrc'),
      JSON.stringify(getEslintConfig(isReact ? 'react' : isVue3 ? 'vue3' : 'vue'))
    );
    writeFile(path.resolve(process.cwd(), '.prettierrc'), JSON.stringify(getPrettierrc()));
  } catch (err) {
    print.error(err);
  }

  let server;
  // 分不同类型构建
  if (useVite) {
    // vite 构建
    const viteConfig = translateHoneyConfigToVite(config, 'development');

    server = await createServer({
      ...viteConfig,

      mode: 'development',
      configFile: false,
    });

    await server.listen();

    server.printUrls();
  } else {
    // webpack 构建
    server = await webpackDev(config);
  }

  // 监听 mock 修改实现热更新
  if (config.dev && config.dev.mock) {
    const mockFile = path.resolve(process.cwd(), config.dev.mock);
    chokidar.watch(mockFile).on(
      'change',
      _.throttle(
        () => {
          if (useVite) {
            server && server.restart();
          } else {
            const tmpServer = server;
            server = null;
            tmpServer &&
              tmpServer.close(async () => {
                server = await webpackDev(config);
              });
          }
        },
        2000,
        { leading: true, trailing: false }
      )
    );
  }
}

function webpackDev(config) {
  return new Promise((resolve) => {
    try {
      //build
      const webpackConfig = generateWebpackConfig(config, 'development');
      const server = new webpackDevServer(webpack(webpackConfig), webpackConfig.devServer);
      server.listen(config.dev.port, '0.0.0.0', () => {
        print.info(`Starting server on http://localhost:${config.dev.port}`);
        resolve(server);
      });
    } catch (err) {
      print.error('server' + err);
      resolve(null);
    }
  });
}

module.exports = {
  devCmd,
};
