const net = require('./util/net')
function loadProjectConfig() {

}

async function loadTemplates() {
  try {
    const data = await net.get('https://raw.githubusercontent.com/tb-fed/config/master/templates.json')
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (err) {
    console.error(err)
  }
  return null
}

module.exports = {
  loadTemplates
}