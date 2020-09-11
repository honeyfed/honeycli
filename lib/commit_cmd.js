const inquirer = require('inquirer');
const {  isGitRepo, getStatus, gitPush,getUnpushedCommits,gitAdd}  = require('./git')


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
  console.log(status)
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
      gitAdd(filesToAdd)
      return true
    }
  }
}

module.exports = {
  gitCommit
}
