const program = require("commander");
const { newCmd } = require("./cmd/new_cmd");
const { serve } = require("./serve");
const {
  gitCommit,
  gitPushCmd,
  generateChangeLog,
} = require("./cmd/commit_cmd");
const { buildCmd } = require("./cmd/build_cmd");
const { devCmd } = require("./cmd/dev_cmd");
const { formatCmd } = require("./cmd/format_cmd");
const { lintCmd } = require("./cmd/lint_cmd");
const print = require("./util/print");
function main() {
  print.info("honey cli");

  program
    .version("1.0.0")
    .command("new <template>")
    .alias("n")
    .description("创建新的项目")
    .action(newCmd);
  program
    .command("commit")
    .alias("c")
    .description("提交代码")
    .action((cmd) => {
      gitCommit();
      // print.info(cmd)
    });
  program
    .command("push")
    .alias("p")
    .description("推送代码")
    .action((cmd) => {
      gitPushCmd();
      // print.info(cmd)
    });
  program
    .command("changelog")
    .alias("log")
    .description("生成changelog")
    .action((cmd) => {
      generateChangeLog();
      // print.info(cmd)
    });
  program
    .command("build")
    .alias("b")
    .description("构建代码")
    .action((cmd) => {
      // console.log(process.cwd())
      buildCmd();
    });
  program
    .command("dev")
    .alias("d")
    .description("启动本地开发")
    .action((cmd) => {
      devCmd();
    });
  program
    .command("lint")
    .alias("l")
    .description("代码检查")
    .action((cmd) => {
      lintCmd();
    });
  program
    .command("format")
    .alias("fmt")
    .description("代码格式化")
    .action((cmd) => {
      formatCmd();
    });
  program
    .command("extend <command>")
    .alias("e")
    .description("run an extend command")
    .action((cmd) => {
      print.info(cmd);
    });
  program
    .command("serve")
    .alias("s")
    .description("run dev serve")
    .action((cmd) => {
      serve();
    });

  program.parse(process.argv);
}

module.exports = {
  main,
};
