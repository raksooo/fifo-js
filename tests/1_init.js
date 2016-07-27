const expect = require('chai').expect,
      FIFO = require('../fifo'),
      FIFOError = require('../fifoError'),
      fs = require('fs')

describe('Initialization', function() {
    describe('File', function() {
        let fifo

        beforeEach(function() {
            fifo = new FIFO()
        })

        afterEach(function() {
            fifo.close()
        })

        it('should exist a fifo at the objects path', function() {
            let stat = fs.statSync(fifo.path)
            expect(stat.isFIFO()).to.be.true
        })

        it('should preserve fifo when closed', function() {
            new FIFO(fifo.path).close()
            let stat = fs.statSync(fifo.path)
            expect(stat.isFIFO()).to.be.true
        })
    })

    it('should not exist a fifo at the objects path', function() {
        let fifo = new FIFO()
        fifo.close()
        expect(fs.statSync.bind(fs, fifo.path)).to.throw(Error)
    })

    it('should throw exception since non-fifo file exists', function() {
        let exceptionPath = 'exceptionTest.fifo'
        fs.closeSync(fs.openSync(exceptionPath, 'w'))
        expect(() => new FIFO(exceptionPath)).to.throw(FIFOError)
        fs.unlink(exceptionPath)
    })
})
