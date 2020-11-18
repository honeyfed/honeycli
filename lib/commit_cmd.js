const inquirer = require('inquirer');
const {  isGitRepo, getStatus, gitPush,getUnpushedCommits,gitAdd}  = require('./git');
const path = require('path');
const standardVersion = require('standard-version')
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;

function userCommit(){
  return bootstrap({
    cliPath: path.join(__dirname, '../node_modules/commitizen'),
    // this is new
    config: {
      "path": "cz-conventional-changelog"
    }
  },'');
}


async function gitCommit(){
  // const git = await isGitRepo()
  // console.log('git', git)
  const status = await getStatus()
  const unPushed = await getUnpushedCommits()
  if(unPushed){
    console.log(
      ` (${unPushed.split('\n').filter(u => u).length} commits unpushed)`
    )
  }
  if(Array.isArray(status)) {
    const answer = await inquirer.prompt({
      type: 'checkbox',
      name: 'files',
      message: 'select files staged for commit:',
      choices: status.map(n => {
        return { name: n }
      }),
      pageSize: 20
    })

    if (answer && answer.files && answer.files.length > 0) {
      // add files
      const filesToAdd = answer.files.length === status.length
        ? '.'
        : answer.files.join(' ')
      const addRes = await gitAdd(filesToAdd)
      if(addRes.code === 0){
        console.log('this.args',this.args)
        let user = await userCommit()
        console.log(user)
      }
      console.log('is-over')
       return true
    }
    // push
    const unPushed = await getUnpushedCommits()
    if (unPushed) {
      console.log(unPushed)

      const answer = await inquirer.prompt({
        type: 'confirm',
        name: 'pushCommits',
        message: 'Do you want to push now?',
        default: false
      })

      if (answer.pushCommits) {
        await gitPush('-u')
      }
    }
  }
}

async function gitPushCmd(){
  await gitPush('-u')
}

async function generateChangeLog(){
  standardVersion({
    noVerify: true,
    infile: 'docs/CHANGELOG.md',
    silent: true
  }).then(() => {
    // standard-version is done
  }).catch(err => {
    console.error(`standard-version failed with message: ${err.message}`)
  })
}

module.exports = {
  gitCommit,
  gitPushCmd,
  generateChangeLog
}
