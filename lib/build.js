const webpack = require('webpack')
const path = require('path')

const { safeReadFileSync } = require('./utils')
const { ArgumentError, ExecutionError } = require('./errors')

const webpackResultHandler = (err, stats) => { // Stats Object
  if (err || stats.hasErrors()) {
    // Handle errors here
    console.error('Error executing webpack', stats ? stats.toString() : err)
    throw new ExecutionError('rewp failed to run webpack.')
  }

  console.log('Webpack finished')
  console.log('Webpack hash:\t\t', stats.hash)
  console.log('Webpack elapsed:\t\t', stats.endTime - stats.startTime)
  console.log('Webpack output', stats.toString())
}

const loadWebpackConfig = (args) => {
  const config = require('./webpack.config')
  if (args.config) {
    const newConfig = safeReadFileSync(path.resolve(args.config))
    if (newConfig) {
      if (args.override) {
        return newConfig
      }
      return Object.assign({}, config, newConfig)
    } else {
      throw new ArgumentError('Failed to read configuration file.')
    }
  }
  return config
}

const build = (args) => {
  try {
    console.log('rewp building...')
    console.log('Using webpack version:', webpack.version)
    const webpackConfig = loadWebpackConfig(args)

    const compiler = webpack(webpackConfig)
    if (args.watch) {
      compiler.watch(null, webpackResultHandler)
    } else {
      compiler.run(webpackResultHandler)
    }
  } catch (error) {
    if (!(error instanceof ExecutionError)) {
      console.error('rewp failed to build.', error)
    }
    process.exit(1)
  }
}

module.exports = build
