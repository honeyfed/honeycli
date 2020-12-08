const request = require("superagent");
// const proxify = require('superagent-proxy')

// proxify(request)

// const proxy = process.env.http_proxy || ''

async function get(url) {
  const resp = await request.get(url); /*.proxy(proxy)*/
  if (resp && resp.status === 200) {
    return resp.text;
  }
  return "";
}

module.exports = {
  get,
};
