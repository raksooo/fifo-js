const expect = require('chai').expect,
      FIFO = require('../fifo'),
      FIFOError = require('../fifoError'),
      fs = require('fs')

describe('Initialization', function() {
    let fifo
    let exceptionPath

    before(function() {
        fifo = new FIFO()
    })

    after(function() {
        fs.unlink(exceptionPath)
    })

    it('should exist a fifo at the objects path', function() {
        let stat = fs.statSync(fifo.path)
        expect(stat.isFIFO()).to.be.true
    })

    it('should not exist a fifo at the objects path', function() {
        fifo.close()
        expect(fs.statSync.bind(fs, fifo.path)).to.throw(Error)
    })

    it('should throw exception since non-fifo file exists', function() {
        exceptionPath = 'exceptionTest.fifo'
        fs.closeSync(fs.openSync(exceptionPath, 'w'))
        expect(() => new FIFO(exceptionPath)).to.throw(FIFOError)
    })
})

