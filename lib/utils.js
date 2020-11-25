const fs = require('fs')
const print = require('./print')
const spawn = require('cross-spawn')
function makeGithubUrlForTbTemplate(templateName) {
  return `https://github.com/tb-fed/template-${templateName}.git`
}

function loadJson(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8')

  try {
    const jsonData = JSON.parse(json)
    return jsonData
  } catch (err) {
    print.error(err)
  }
  return null
}

function isValidName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name)
}

function doCmd(cmd, arr, std = {stdio: 'inherit'}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, arr, std)
    if(std.stdio){
      child.on('close', code=> {
        resolve({code})
      })
    }else {
      child.stdout.on('data', data =>{
        resolve({data})
      })
      child.stdout.on('close', data =>{
        resolve({data})
      })
    }
  })
}



module.exports = {
  makeGithubUrlForTbTemplate,
  loadJson,
  isValidName,
  doCmd
}
