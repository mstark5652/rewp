#! /usr/bin/env node
const argParser = require('command-line-parser')
const args = argParser(process.argv)
const build = require('./build')
const test = require('./test')

if (args.attrs.includes('build')) {
  build(args)
} else if (args.attrs.includes('test')) {
  test(args)
} else if (args.attrs.includes('version')) {
  console.log(`v${require('../package.json').version}`)
  process.exit(0)
} else {
  console.error('Mode not recognized.')
  console.log('Usage: rewp <mode>')
  console.log('Where <mode> is one of [build, test, version]')
  process.exit(0)
}
