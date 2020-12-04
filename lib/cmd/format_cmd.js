const{loadHoneyConfig}=require("../util/config"),{getFiles,readFile,writeFile}=require("../util/utils"),print=require("../util/print"),prettier=require("prettier"),path=require("path");async function formatCmd(){const a=loadHoneyConfig();let b=await getFiles(a.src+"/**/*.js");const c=await getFiles(a.src+"/**/*.vue");b=[...b,...c];const d={// parser: 'babel'
};b.forEach(async a=>{print.info(`formatting ${a}...`);const b=readFile(a),c=path.extname(a);d.parser=".vue"===c?"vue":"babel";const e=prettier.format(b,d);writeFile(a,e||"")})}module.exports={formatCmd};