const request=require("superagent");// const proxify = require('superagent-proxy')
// proxify(request)
// const proxy = process.env.http_proxy || ''
async function get(a){const b=await request.get(a);/*.proxy(proxy)*/return b&&200===b.status?b.text:""}module.exports={get};