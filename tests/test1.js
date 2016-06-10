const FIFO = require('../fifo')

let fifo = new FIFO('asdf.fifo')
setTimeout(() => {
    fifo.setReader(console.log.bind(console))
    fifo.write('hej')

    setTimeout(() => {
        console.log(fifo.read())
        fifo.close()
        fifo.close()
    }, 4000)
}, 1000)

