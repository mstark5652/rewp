
const safeReadFileSync = (filepath, options) => {
  const fs = require('fs')
  const path = require('path')
  try {
    const { ext } = path.parse(filepath)
    if (ext === 'js') {
      return require(filepath)
    }
    return fs.readFileSync(filepath, options)
  } catch (error) { }
}

module.exports = {
  safeReadFileSync
}
