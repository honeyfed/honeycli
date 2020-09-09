const spawn = require('cross-spawn')
const { GitError } = require('./errors')
function gitClone(url, newName = '') {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['clone', url, newName, '--depth', 1], {stdio: 'inherit'})
    child.on('close', code=> {
      if (code !== 0) {
        reject(new GitError('git clone failed'))
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  gitClone
}