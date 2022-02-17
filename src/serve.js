const fs = require('fs');
const path = require('path');
const { doCmd } = require('./util/utils');

async function serve() {
  const currentPath = path.resolve('./');
  const dirs = fs.readdirSync(currentPath);
  if (dirs.length <= 0) {
    console.error('当前文件夹为空');
    return;
  }
  let packageFile = dirs.filter((value) => {
    return value.indexOf('package.json') > -1;
  });
  if (!packageFile) {
    console.error('当前文件夹不存在package.json文件，请添加');
    return;
  }
  const code = await doCmd('npm', ['install']);
  if (code !== 0) {
    console.error('install error');
    return;
  }
  let packageData = fs.readFileSync(`${currentPath}/package.json`);
  const jsonData = JSON.parse(packageData);
  let scripts = jsonData.scripts;
  if (!scripts['dev']) {
    console.error('当前package.json文件中不存在dev命令');
    return;
  }
  await doCmd('npm', ['run', 'dev']);
}

module.exports = {
  serve,
};
