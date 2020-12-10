const inquirer = require("inquirer");
const {
  getStatus,
  gitPush,
  getUnpushedCommits,
  gitAdd,
} = require("../git/git");
const path = require("path");
const standardVersion = require("standard-version");
const bootstrap = require("commitizen/dist/cli/git-cz").bootstrap;
const print = require("../util/print");
const { formatCmd } = require("./format_cmd");
const {getPathInLib}=require('../dir')
function userCommit() {
  return bootstrap(
    {
      cliPath: getPathInLib('./node_modules/commitizen'),
      // this is new
      config: {
        path: getPathInLib('./3rd/cz-conventional-changelog'),
      },
    },
    ""
  );
}

async function gitCommit() {
  // format code
  await formatCmd();
  // const git = await isGitRepo()
  // console.log('git', git)
  const status = await getStatus();
  const unPushed = await getUnpushedCommits();
  if (unPushed) {
    console.log(
      ` (${unPushed.split("\n").filter((u) => u).length} commits unpushed)`
    );
  }
  if (Array.isArray(status)) {
    const answer = await inquirer.prompt({
      type: "checkbox",
      name: "files",
      message: "请选择要提交的文件:",
      choices: status.map((n) => {
        return { name: n };
      }),
      pageSize: 20,
    });

    if (answer && answer.files && answer.files.length > 0) {
      // add files
      const filesToAdd =
        answer.files.length === status.length ? "." : answer.files.join(" ");
      const addRes = await gitAdd(filesToAdd);
      if (addRes.code === 0) {
        await userCommit();
      }
      return true;
    }
  }
}

async function gitPushCmd() {
  // push
  const unPushed = await getUnpushedCommits();
  if (unPushed) {
    const answer = await inquirer.prompt({
      type: "confirm",
      name: "pushCommits",
      message: "Do you want to push now?",
      default: false,
    });

    if (answer.pushCommits) {
      await gitPush("-u");
    }
  }
}

async function generateChangeLog() {
  standardVersion({
    noVerify: true,
    infile: "docs/CHANGELOG.md",
    silent: true,
  })
    .then(() => {
      // standard-version is done
      print.info("changelog 生成成功，位于docs/CHANGELOG.md文件中");
    })
    .catch((err) => {
      print.error(`standard-version failed with message: ${err.message}`);
    });
}

module.exports = {
  gitCommit,
  gitPushCmd,
  generateChangeLog,
};
