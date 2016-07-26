const FIFO = require('../fifo')

let fifo = new FIFO('asdf.fifo')
setTimeout(() => {
    fifo.read(console.log.bind(console))
    fifo.write('Async')

    setTimeout(() => {
        fifo.write('Sync')
        console.log(fifo.readSync())
        fifo.close()
    }, 4000)
}, 1000)

