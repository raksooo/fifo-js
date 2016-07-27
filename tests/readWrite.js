const FIFO = require('../fifo')

let fifo = new FIFO('asdf.fifo')
fifo.write('1\n', () => {
    console.log('in: 1')
})
fifo.read((data) => {
    console.log('out: ', data)
})

setTimeout(() => {
    fifo.read((data) => {
        console.log('out: ', data)
    })
    fifo.write('2\n', () => {
        console.log('in: 2')
    })
}, 100)

setTimeout(() => {
    fifo.read((data) => {
        console.log('out: ', data)
    })
    console.log(fifo.writeSync('4\n'))
}, 400)

setTimeout(() => {
    fifo.close()
}, 500)
