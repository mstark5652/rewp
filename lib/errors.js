
class ArgumentError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ArgumentError'
    this.message = message
  }
}

class ExecutionError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ExecutionError'
    this.message = message
  }
}

module.exports = {
  ArgumentError,
  ExecutionError
}
