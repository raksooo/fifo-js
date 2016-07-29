const expect = require('chai').expect,
      FIFO = require('../fifo'),
      FIFOError = require('../fifoError')

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

    it('should read asyncronously and write synchronously', function() {
        let string = 'Test string 4'
        fifo.write(string)
        let data = fifo.readSync()
        expect(data).to.equal(string)
    })

    it('should preserve newline and spaces at start and end of string', function() {
        let string = ' Test string 5\n'
        fifo.write(string)
        let data = fifo.readSync()
        expect(data).to.equal(string)
    })

    describe('Reader', function() {
        let fifo

        beforeEach(function() {
            fifo = new FIFO()
        })

        afterEach(function() {
            fifo.close()
        })

        it('should read all values that\'s written', function(done) {
            let reads = 0

            fifo.setReader(data => {
                reads++
                if (data === 'first') {
                    fifo.writeSync('last')
                } else if (data === 'last') {
                    expect(reads).to.equal(2)
                    done()
                } else {
                    throw new Error('Should not get here: ' + data)
                }
            })

            fifo.writeSync('first')
        })

        it('should read properly after reader has been closed', function(done) {
            fifo.setReader(data => {
                if (data === 'first') {
                    fifo.removeReader()
                    fifo.read(data => {
                        expect(data).to.equal('last')
                        done()
                    })
                    fifo.writeSync('last')
                } else {
                    throw new Error('Should not get here: ' + data)
                }
            })

            fifo.writeSync('first')
        })

        it('should throw when reading while reader is set', function() {
            fifo.setReader()
            expect(fifo.read.bind(fifo)).to.throw(FIFOError)
        })

        it('should allow reading after reader has been removed', function() {
            fifo.setReader()
            fifo.removeReader()
            expect(fifo.read.bind(fifo)).to.not.throw(Error)
        })
    })
})

