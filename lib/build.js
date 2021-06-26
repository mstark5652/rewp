const webpack = require('webpack')
const path = require('path')
const deepmerge = require('deepmerge')
const httpServer = require('http-server')

const { safeReadFileSync } = require('./utils')
const { ArgumentError, ExecutionError } = require('./errors')

const serveOptions = {
  port: (+process.env.PORT) || 3000
}

const webpackResultHandler = (err, stats) => { // Stats Object
  if (err) {
    // Handle webpack execution errors
    console.error('Error executing webpack', stats ? stats.toString() : err)
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    throw new ExecutionError('rewp failed to run webpack.')
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    // compile has errors
    console.error(info.errors)
  }

  if (stats.hasWarnings()) {
    // compile has warnings
    console.warn(info.warnings)
  }

  // Log result...

  console.log('Webpack finished')
  console.log('Webpack hash:\t\t', stats.hash)
  console.log('Webpack elapsed:\t\t', stats.endTime - stats.startTime)
  console.log('Webpack output', stats.toString({ colors: true }))
}

const loadWebpackConfig = (args) => {
  const config = require('./webpack.config')
  if (args.config) {
    const newConfig = safeReadFileSync(path.resolve(args.config))
    if (newConfig) {
      if (args.override) {
        return newConfig
      }
      return deepmerge.all({}, config, newConfig)
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
      const server = httpServer.createServer()
      server.listen(serveOptions.port, () => {
        console.info('Listening on port:', serveOptions.port)
      })
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
