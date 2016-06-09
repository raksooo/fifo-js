const FIFO = require('../fifo')

let fifo = new FIFO()
setTimeout(() => {
    fifo.write('hej')

    setTimeout(() => {
        fifo.close()
    }, 4000)
}, 1000)

