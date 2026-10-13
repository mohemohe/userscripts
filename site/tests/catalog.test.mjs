import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { generateCatalog, parseMetadata, scanRepository } from "../scripts/generate-catalog.mjs"

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "userscripts-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  const put = async (file, content = "// script\n") => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true })
    await writeFile(path.join(root, file), content)
  }
  return { root, put }
}

test("recursively groups scripts by directory, retaining README and metadata", async (t) => {
  const { root, put } = await fixture(t)
  await put("WIRED lint/README.md", "# Test\n\n![preview](image.png)")
  await put("WIRED lint/a.user.js", "// ==UserScript==\r\n// @name First\r\n// @version 1.2\r\n// @description Test script\r\n// ==/UserScript==\r\n")
  await put("WIRED lint/b.user.js")
  await put("group/日本語 #1/nested.user.js")
  await put("docs/README.md", "Not a script directory")
  const result = await scanRepository(root)
  assert.deepEqual(result.map((entry) => entry.id), ["group/日本語 #1", "WIRED lint"])
  assert.equal(result[0].readme, null)
  assert.equal(result[1].readme, "# Test\n\n![preview](image.png)")
  assert.deepEqual(result[1].scripts.map((script) => script.fileName), ["a.user.js", "b.user.js"])
  assert.equal(result[1].scripts[0].name, "First")
  assert.equal(result[1].scripts[0].version, "1.2")
  assert.equal(result[1].scripts[0].description, "Test script")
})

test("ignores infrastructure, hidden directories, symlinks, and root scripts", async (t) => {
  const { root, put } = await fixture(t)
  for (const directory of ["site", "node_modules", "dist", ".git", ".private", "nested/build", "coverage"]) {
    await put(`${directory}/hidden.user.js`)
  }
  await put("root.user.js")
  await put("real/visible.user.js")
  await symlink(path.join(root, "real"), path.join(root, "linked"), "dir")
  await symlink(path.join(root, "real/visible.user.js"), path.join(root, "real/linked.user.js"))
  const result = await scanRepository(root)
  assert.deepEqual(result.map((entry) => entry.id), ["real"])
  assert.equal(result[0].scripts.length, 1)
})

test("copies install files byte-for-byte and removes obsolete generated files", async (t) => {
  const { root, put } = await fixture(t)
  const source = Buffer.from("// ==UserScript==\r\n// @name 元のスクリプト\r\n// ==/UserScript==\r\nalert('test')\r\n")
  await put("space 日本語/a #1.user.js", source)
  const options = { root, output: path.join(root, "site/public/userscripts"), dataFile: path.join(root, "site/src/generated/catalog.json") }
  await generateCatalog(options)
  assert.deepEqual(await readFile(path.join(options.output, "space 日本語/a #1.user.js")), source)
  assert.equal(JSON.parse(await readFile(options.dataFile, "utf8"))[0].id, "space 日本語")
  await rm(path.join(root, "space 日本語"), { recursive: true })
  assert.deepEqual(await generateCatalog(options), [])
  await assert.rejects(readFile(path.join(options.output, "space 日本語/a #1.user.js")), { code: "ENOENT" })
})

test("metadata must be inside the userscript header", () => {
  assert.deepEqual(parseMetadata("// @name not metadata"), {})
  assert.deepEqual(parseMetadata("// ==UserScript==\n// @name First\n// @name Second\n// ==/UserScript==\n// @version ignored"), { name: "First" })
})
