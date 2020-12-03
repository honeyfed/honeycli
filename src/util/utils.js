const fs = require('fs')
const print = require('./print')
const spawn = require('cross-spawn')
const rmcb = require("rimraf");
const util = require('util')
const glob=require('glob')
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

function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8')
}

function writeFile(filepath, content) {
  fs.writeFileSync(filepath, content)
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

const rm = util.promisify(rmcb);


function getFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

module.exports = {
  makeGithubUrlForTbTemplate,
  loadJson,
  isValidName,
  doCmd,
  rm,
  readFile,
  writeFile,
  getFiles
}
