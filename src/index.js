const program = require('commander');
const { newCmd } = require('./cmd/new_cmd');
const { serve } = require('./serve');
const { gitCommit, gitPushCmd, generateChangeLog } = require('./cmd/commit_cmd');
const { buildCmd } = require('./cmd/build_cmd');
const { devCmd } = require('./cmd/dev_cmd');
const { formatCmd } = require('./cmd/format_cmd');
const { lintCmd } = require('./cmd/lint_cmd');
const { cdnCmd } = require('./cmd/cdn_cmd');
const { upgradeCmd } = require('./cmd/upgrade_cmd');
const print = require('./util/print');
const { loadJson } = require('./util/utils');
const path = require('path');
const { getPathInLib } = require('./dir');
function main() {
  const packageJson = loadJson(getPathInLib('./package.json'));
  print.info(`honey cli v${packageJson.version}`);

  program
    .version(packageJson.version)
    .command('new')
    .alias('n')
    .description('创建新的项目')
    .action(newCmd);
  program
    .command('commit')
    .alias('c')
    .description('提交代码')
    .action((cmd) => {
      gitCommit();
      // print.info(cmd)
    });
  program
    .command('push')
    .alias('p')
    .description('推送代码')
    .action((cmd) => {
      gitPushCmd();
      // print.info(cmd)
    });
  program
    .command('changelog')
    .alias('log')
    .description('生成changelog')
    .action((cmd) => {
      generateChangeLog();
      // print.info(cmd)
    });
  program
    .command('build')
    .alias('b')
    .description('构建代码')
    .action((cmd) => {
      // console.log(process.cwd())
      buildCmd();
    });
  program
    .command('cdn')
    .description('资源上传cdn')
    .action((cmd) => {
      // console.log(process.cwd())
      cdnCmd();
    });
  program
    .command('dev')
    .option('-f, --fast', '快速启动开发环境')
    .alias('d')
    .description('启动本地开发')
    .action((cmd) => {
      devCmd(cmd);
    });
  program
    .command('lint')
    .alias('l')
    .description('代码检查')
    .action((cmd) => {
      lintCmd();
    });
  program
    .command('format')
    .alias('fmt')
    .description('代码格式化')
    .action((cmd) => {
      formatCmd();
    });
  program
    .command('extend <command>')
    .alias('e')
    .description('run an extend command')
    .action((cmd) => {
      print.info(cmd);
    });
  program
    .command('upgrade')
    .alias('u')
    .description('检查最新版本honey-cli')
    .action((cmd) => {
      upgradeCmd();
    });

  program.parse(process.argv);
}

module.exports = {
  main,
};
