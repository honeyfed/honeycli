
const program=require('commander')
function main() {
  console.log('tb')
  
  program
    .version('1.0.0')
    .command('new <template>')
    .alias('n')
    .description('create a new project')
    .action(cmd=>{
      console.log(cmd)
    })
  program
    .command('commit')
    .alias('c')
    .description('a strict git commit')
    .action(cmd=>{
      console.log(cmd)
    })
  program
    .command('lint')
    .alias('l')
    .description('run an eslint check and fix')
    .action(cmd=>{
      console.log(cmd)
    })
  program
    .command('extend <command>')
    .alias('e')
    .description('run an extend command')
    .action(cmd=>{
      console.log(cmd)
    })
  
  program.parse(process.argv)


}

module.exports = {
  main
}
