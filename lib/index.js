
const program=require('commander')
const {newCmd} = require('./new_cmd')
const {serve} = require('./serve')
const {gitCommit,generateChangeLog} = require('./commit_cmd')
const print = require('./print')
function main() {
  print.info('tb')

  program
    .version('1.0.0')
    .command('new <template>')
    .alias('n')
    .description('create a new project')
    .action(newCmd)
  program
    .command('commit')
    .alias('c')
    .description('a strict git commit')
    .action(cmd=>{
      gitCommit()
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
