const FIFO = require('../fifo'),
      FifoException = require('../fifoException'),
      fs = require('fs')


let path = 'asdf.fifo'
fs.closeSync(fs.openSync(path, 'w'))
try {
    let fifo = new FIFO(path)
    console.log('failure')
} catch (e) {
    if (e instanceof FifoException) {
        console.log('success')
    }
    fs.unlink(path)
}

