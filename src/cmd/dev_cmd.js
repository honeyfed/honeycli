/**
 * This module is based on webpack. It provides development and deploy features.
 */

const { doCmd, rm, writeFile } = require('../util/utils');
const print = require('../util/print');
const { getEslintrc, getEslintConfig } = require('../lint/lint');
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
        'eslint-plugin-vue',
        'eslint-plugin-prettier@^3',
        'eslint-plugin-react',
        'eslint-config-tencent',
      ]);
      await doCmd('npm', ['i']);
      await rm(path.resolve(process.cwd(), '.eslintrc.js'));
      await rm(path.resolve(process.cwd(), '.eslintrc.json'));
      await rm(path.resolve(process.cwd(), '.eslintrc'));
      await rm(path.resolve(process.cwd(), '.prettierrc'));
    } catch (err) {
      print.error(err);
    }
  }

  print.info('begin dev server');

  // 读取 package.json 中配置
  const config = loadHoneyConfig();

  // 注入配置文件
  try {
    // if (config.isReact) {
    //   writeFile(path.resolve(process.cwd(), '.eslintrc.js'), getEslintrc(1));
    // } else {
    //   writeFile(path.resolve(process.cwd(), '.eslintrc.js'), getEslintrc(0));
    // }
    writeFile(
      path.resolve(process.cwd(), '.eslintrc'),
      JSON.stringify(getEslintConfig(config.isReact ? 'react' : 'vue'))
    );
    writeFile(path.resolve(process.cwd(), '.prettierrc'), JSON.stringify(getPrettierrc()));
  } catch (err) {
    print.error(err);
  }

  // 分不同类型构建
  if (config.useVite) {
    // vite 构建
    const viteConfig = translateHoneyConfigToVite(config, 'development');

    const server = await createServer({
      ...viteConfig,

      mode: 'development',
      configFile: false,
    });

    await server.listen();

    server.printUrls();
  } else {
    // webpack 构建
    let server = await webpackDev(config);

    if (config.dev && config.dev.mock) {
      const mockFile = path.resolve(process.cwd(), config.dev.mock);

      // 监听 mock 修改实现热更新
      chokidar.watch(mockFile).on(
        'change',
        _.throttle(
          () => {
            const tmpServer = server;
            server = null;
            tmpServer &&
              tmpServer.close(async () => {
                server = await webpackDev(config);
              });
          },
          2000,
          { leading: true, trailing: false }
        )
      );
    }
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
