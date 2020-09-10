const { loadJson } = require("../lib/utils.js");
const path = require('path')

test("load json", () => {
  const data = loadJson(path.resolve(__dirname, '../package.json'))
  expect(data).not.toBeNull()
});
