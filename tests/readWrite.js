const expect = require('chai').expect,
      FIFO = require('../fifo')

describe('Read and write', function() {
    let fifo

    before(function() {
        fifo = new FIFO()
    })

    after(function() {
        fifo.close()
    })

    it('should write and read asynchronously', function(done) {
        let string = 'Test string 1'
        fifo.write(string)
        fifo.read(data => {
            expect(data).to.equal(string)
            done()
        })
    })

    it('should read and write asynchronously', function(done) {
        let string = 'Test string 2'
        fifo.read(data => {
            expect(data).to.equal(string)
            done()
        })
        fifo.write(string)
    })

    it('should read asyncronously and write synchronously', function(done) {
        let string = 'Test string 3'
        fifo.read(data => {
            expect(data).to.equal(string)
            done()
        })
        fifo.writeSync(string)
    })
})

