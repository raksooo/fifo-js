const FIFO = require('../fifo')

let fifo = new FIFO('asdf.fifo')
setTimeout(() => {
    fifo.setReader(console.log.bind(console))
    fifo.write('hej')

    setTimeout(() => {
        fifo.write('hej')
        console.log(fifo.read())
        fifo.close()
    }, 4000)
}, 1000)

