const ExtendableError = require('es6-error')

class FIFOError extends ExtendableError {
    constructor(name, message) {
        super(name + ': ' + message)
    }
}

module.exports = FIFOError

