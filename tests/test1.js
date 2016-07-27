const FIFO = require('../fifo')

let fifo = new FIFO('asdf.fifo')
setTimeout(() => {
    fifo.write('1', (data) => {
        console.log('in: ', data)
    })
    fifo.read((data) => {
        console.log('out: ', data)
    })

    fifo.write('2', (data) => {
        console.log('in: ', data)
    })
    console.log('out:', fifo.readSync())

    fifo.read((data) => {
        console.log('out: ', data)
    })
    console.log(fifo.writeSync('3'))


    fifo.close()
}, 2000)

