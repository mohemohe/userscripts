export const repository = "https://github.com/mohemohe/userscripts"
const rawRepository = "https://raw.githubusercontent.com/mohemohe/userscripts/master"

/** @param {string} value */
export function encodePath(value) {
  return value.split("/").map(encodeURIComponent).join("/")
}

/** @param {string} filePath @param {string} base */
export function installUrl(filePath, base = "./") {
  return `${base}userscripts/${encodePath(filePath)}`
}

/** @param {string} directory */
export function sourceUrl(directory) {
  return `${repository}/tree/master/${encodePath(directory)}`
}

/** Resolve README-relative references against their original repository location.
 * @param {string} url @param {string} directory @param {boolean} image
 */
export function readmeUrl(url, directory, image = false) {
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return url
  const base = image ? rawRepository : `${repository}/blob/master`
  const readme = `${base}/${encodePath(directory)}/README.md`
  // Leading slashes in a README refer to the repository root, not github.com.
  return new URL(url.startsWith("/") ? `${base}${url}` : url, readme).href
}
