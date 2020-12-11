const print = require("../util/print");
const { doCmd, loadJson } = require("../util/utils");
const { getPathInLib } = require("../dir");
const compareVersions = require("compare-versions");
async function upgradeCmd() {
  print.info("正在检查更新...");
  const packageJson = loadJson(getPathInLib("./package.json"));
  const data = await doCmd("npm", ["view", packageJson.name, "version"], {});
  const latestVersion = Buffer.from(data.data)
    .toString()
    .trim();
  const currentVersion = packageJson.version;

  const needUpgrade = compareVersions(latestVersion, currentVersion);

  if (needUpgrade === 0) {
    print.info("当前是最新版本哦，亲~");
  } else if (needUpgrade === 1) {
    print.info(`发现新版本: ${latestVersion}`);
    print.info("尝试升级中...");
    const res = await doCmd("npm", ["i", "-g", packageJson.name]);
    if (res.code === 0) {
      print.info("安装成功");
    } else {
      print.error("安装失败");
      print.info(
        `请用管理员权限尝试该命令: npm install --global ${packageJson.name}`
      );
    }
  } else {
    print.info('年轻人不讲武德哦~');
  }
}

module.exports = {
  upgradeCmd,
};
