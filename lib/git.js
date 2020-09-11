const spawn = require('cross-spawn')
const { GitError } = require('./errors')
const { doCmd } = require('./utils')
const getSteam = require('get-stream')
const root = process.cwd()
const isWin = process.platform === 'win32'
// git 拷贝操作
async function gitClone(url, newName = '') {
  const data = await doCmd('git',['clone', url, newName, '--depth', 1], {stdio: 'inherit'})
  if(data.code !== 0){
    new GitError('git clone failed')
    return
  }
  return  data.code
}

// 判断是否是git目录
async function isGitRepo(dir) {
  try {
    const ret = await doCmd('git', ['rev-parse', '--git-dir'], {
      cwd: dir,
      stdio: 'inherit'
    })
    return ret.code === 0
  } catch (err) {
    return false
  }
}

async function showStatus(filepath){
  await doCmd('git',['status','--short',filepath || '.'], {
    cwd: root,
    stdio: 'inherit'
  })
}

async function getStatus(filepath) {
  const data = await doCmd('git',['status','--short',filepath || '.'], {
    cwd: root
  })
  let res = Buffer.from(data.data)
  res = res.toString()
  if (res.trim()) {
    res = res.split('\n').filter(p => p.trim())
    if (isWin) {
      res = res.map(i => i.slice(3))
    }
    await showStatus()
    return res
  }

}


async function gitPush(args) {
  await doCmd('git',['push',args || '.'],{
    cwd: root,
    stdio: 'inherit'
  })
}

async function gitAdd(filesToAdd) {
  await doCmd('git',['add',filesToAdd],{
    cwd: root,
    stdio: 'inherit'
  })
}

async function getUnpushedCommits() {
  const data = await doCmd('git',['cherry','-v'], {
    cwd: root
  })
  if(data.data){
    let res = Buffer.from(data.data)
    return res.toString()
  }else {
    return data.data
  }

}




module.exports = {
  gitClone,
  isGitRepo,
  getStatus,
  gitPush,
  getUnpushedCommits,
  gitAdd
}
