import assert from "node:assert/strict"
import test from "node:test"
import { installUrl, readmeUrl, sourceUrl } from "../src/lib/urls.mjs"

test("install links work under project Pages paths and encode every path segment", () => {
  const url = installUrl("日本語/space #1/a.user.js", "/userscripts/")
  assert.equal(url, "/userscripts/userscripts/%E6%97%A5%E6%9C%AC%E8%AA%9E/space%20%231/a.user.js")
  assert.equal(new URL(installUrl("WIRED lint/a.user.js"), "https://example.com/userscripts/?script=test").href, "https://example.com/userscripts/userscripts/WIRED%20lint/a.user.js")
  assert.equal(sourceUrl("WIRED lint"), "https://github.com/mohemohe/userscripts/tree/master/WIRED%20lint")
})

test("README relative links and images resolve from the source directory", () => {
  assert.equal(readmeUrl("./images/test.png", "WIRED lint", true), "https://raw.githubusercontent.com/mohemohe/userscripts/master/WIRED%20lint/images/test.png")
  assert.equal(readmeUrl("../LICENSE", "WIRED lint"), "https://github.com/mohemohe/userscripts/blob/master/LICENSE")
  assert.equal(readmeUrl("/LICENSE", "WIRED lint"), "https://github.com/mohemohe/userscripts/blob/master/LICENSE")
  assert.equal(readmeUrl("#before", "WIRED lint"), "https://github.com/mohemohe/userscripts/blob/master/WIRED%20lint/README.md#before")
  assert.equal(readmeUrl("https://i.imgur.com/example.png", "WIRED lint", true), "https://i.imgur.com/example.png")
  assert.equal(readmeUrl("", "WIRED lint"), "")
})
