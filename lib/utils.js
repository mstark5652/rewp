
const safeReadFileSync = (filepath, options) => {
  const fs = require('fs')
  const path = require('path')
  try {
    const { ext } = path.parse(filepath)
    if (ext === '.js') {
      return require(filepath)
    }
    return JSON.parse(fs.readFileSync(filepath, options).toString())
  } catch (error) { }
}

module.exports = {
  safeReadFileSync
}
