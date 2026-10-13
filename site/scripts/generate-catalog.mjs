import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ignoredDirectories = new Set(["node_modules", "dist", "build", "coverage"])
const sortByName = (a, b) => a.name.localeCompare(b.name, "en")

export function parseMetadata(source) {
  const header = source.match(/\/\/\s*==UserScript==([\s\S]*?)\/\/\s*==\/UserScript==/)
  const metadata = {}
  for (const line of (header?.[1] ?? "").split(/\r?\n/)) {
    const match = line.match(/^\s*\/\/\s*@(name|description|version)\s+(.+?)\s*$/)
    if (match && !Object.hasOwn(metadata, match[1])) metadata[match[1]] = match[2]
  }
  return metadata
}

export async function scanRepository(root) {
  const catalog = []
  async function visit(directory) {
    const entries = (await readdir(directory, { withFileTypes: true })).sort(sortByName)
    const relative = path.relative(root, directory).split(path.sep).join("/")
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".user.js"))
    if (relative && files.length) {
      let readme = null
      if (entries.some((entry) => entry.isFile() && entry.name === "README.md")) {
        readme = await readFile(path.join(directory, "README.md"), "utf8")
      }
      const scripts = await Promise.all(files.map(async (file) => ({
        fileName: file.name,
        path: `${relative}/${file.name}`,
        ...parseMetadata(await readFile(path.join(directory, file.name), "utf8")),
      })))
      catalog.push({ id: relative, name: path.basename(directory), readme, scripts })
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".") || ignoredDirectories.has(entry.name)) continue
      if (!relative && entry.name === "site") continue
      await visit(path.join(directory, entry.name))
    }
  }
  await visit(root)
  return catalog
}

export async function generateCatalog({ root, output, dataFile }) {
  const catalog = await scanRepository(root)
  await rm(output, { recursive: true, force: true })
  await mkdir(output, { recursive: true })
  for (const entry of catalog) {
    for (const script of entry.scripts) {
      const destination = path.join(output, script.path)
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(path.join(root, script.path), destination)
    }
  }
  await mkdir(path.dirname(dataFile), { recursive: true })
  await writeFile(dataFile, JSON.stringify(catalog, null, 2) + "\n")
  return catalog
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const site = fileURLToPath(new URL("../", import.meta.url))
  const catalog = await generateCatalog({
    root: path.resolve(site, ".."),
    output: path.join(site, "public/userscripts"),
    dataFile: path.join(site, "src/generated/catalog.json"),
  })
  console.log(`Generated ${catalog.length} UserScript directories.`)
}
