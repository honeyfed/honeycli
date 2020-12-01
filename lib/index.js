
const program=require('commander')
const {newCmd} = require('./new_cmd')
const {serve} = require('./serve')
const {gitCommit,gitPushCmd,generateChangeLog} = require('./commit_cmd')
const print = require('./print')
function main() {
  print.info('honey cli')

  program
    .version('1.0.0')
    .command('new <template>')
    .alias('n')
    .description('创建新的项目')
    .action(newCmd)
  program
    .command('commit')
    .alias('c')
    .description('提交代码')
    .action(cmd=>{
      gitCommit()
      // print.info(cmd)
    })
  program
    .command('push')
    .alias('p')
    .description('推送代码')
    .action(cmd=>{
      gitPushCmd()
      // print.info(cmd)
    })
  program
    .command('changelog')
    .alias('log')
    .description('a strict git changelog')
    .action(cmd=>{
      generateChangeLog()
      // print.info(cmd)
    })
  program
    .command('lint')
    .alias('l')
    .description('run an eslint check and fix')
    .action(cmd=>{
      print.info(cmd)
    })
  program
    .command('extend <command>')
    .alias('e')
    .description('run an extend command')
    .action(cmd=>{
      print.info(cmd)
    })
  program
    .command('serve')
    .alias('s')
    .description('run dev serve')
    .action(cmd=>{
      serve()
    })

  program.parse(process.argv)


}

module.exports = {
  main
}
