const { loadJson, makeGithubUrlForTbTemplate } = require("../lib/utils.js");
const path = require("path");

test("load json", () => {
  const data = loadJson(path.resolve(__dirname, "../package.json"));
  expect(data).not.toBeNull();
});

test("generate github url by template name", () => {
  const githubUrl = makeGithubUrlForTbTemplate("pcweb");
  expect(githubUrl).toBe("https://github.com/tb-fed/template-pcweb.git");
});
