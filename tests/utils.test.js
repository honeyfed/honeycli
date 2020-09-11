const { loadJson, makeGithubUrlForTbTemplate, isValidName } = require("../lib/utils.js");
const path = require("path");

test("load json", () => {
  const data = loadJson(path.resolve(__dirname, "../package.json"));
  expect(data).not.toBeNull();
});

test("generate github url by template name", () => {
  const githubUrl = makeGithubUrlForTbTemplate("pcweb");
  expect(githubUrl).toBe("https://github.com/tb-fed/template-pcweb.git");
});

test("check a valid name", () => {
  const valid = isValidName("new_project001")
  expect(valid).toBe(true)
})

test("check a invalid name", () => {
  const valid = isValidName("new prouje name")
  expect(valid).toBe(false)
})

