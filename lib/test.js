const path = require('path')
const jest = require('jest-cli/build/cli')

const test = (args) => {
  const jestConfig = []
  const config = {
    watchAll: args.watchAll,
    coverage: args.coverage,
    rootDir: process.cwd(),
    moduleDirectory: path.join(__dirname, '..', 'node_modules')
  }
  jestConfig.push('--config', JSON.stringify(config))
  jest.run(jestConfig)
    .catch((error) => {
      console.log('Error:')
      console.log(error)
    })
    .finally(() => {
      console.log('Done')
    })
}

module.exports = test
