const spawn = require('cross-spawn')
function gitClone(url, newName = '') {
  spawn.sync('git', ['clone', url, newName, '--depth', 1], {stdio: 'inherit'})
}

module.exports = {
  gitClone
}