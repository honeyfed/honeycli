const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')

async function serve(){
  const currentPath = path.resolve('./');
  console.log(currentPath)
  const dirs = fs.readdirSync(currentPath)
  console.log(dirs)
  if (dirs.length <= 0 ){
    console.error('当前文件夹为空')
    return
  }
  console.log(dirs)
  let packageFile = dirs.filter((value) => {
    return value.indexOf('package.json') > -1
  })
  if(!packageFile){
    console.error('当前文件夹不存在package.json文件，请添加')
    return
  }
  const code = await doCmd('npm', ['install'])
  if(code !== 0){
    console.error('install error')
    return
  }
  console.log(`${currentPath}\\package.json`)
  let packageData = fs.readFileSync(`${currentPath}/package.json`);
  console.log(JSON.parse(packageData))
  const jsonData = JSON.parse(packageData)
  let scripts = jsonData.scripts
  console.log(scripts)
  if(!scripts['dev']){
    console.error('当前package.json文件中不存在dev命令')
    return
  }
  await doCmd('npm', ['run','dev'])
}

function doCmd(cmd, arr) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, arr, {stdio: 'inherit'})
    child.on('close', code=> {
        resolve(code)
    })
  })
}


module.exports = {
  serve
}
