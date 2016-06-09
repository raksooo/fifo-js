const cp = require('child_process'),
      fs = require('fs')

class FIFO {
    constructor(path) {
        this.path = path || this._generateFifoPath()
        this.children = []

        this._initFifo()
    }

    _initFifo() {
        let stat = this._statSafe(this.path)
        if (!stat) {
            this._createFifo()
        } else if (!stat.isFIFO()) {
            this._unlink()
            this._createFifo()
        } else {
            this.preserve = true
        }
    }

    _createFifo() {
        cp.execSync('mkfifo ' + this.path)
    }

    _statSafe(path) {
        try {
            return fs.statSync(path)
        } catch(e) {
            return false
        }
    }

    _generateFifoPath() {
        let random
        let path
        do {
            random = Math.floor(Math.random() * 8999 + 1000)
            path = '/tmp/fifo-js-' + random + '.fifo'
        } while (this._statSafe(path))

        return path
    }

    setReader(reader) {
        let stream = fs.createReadStream(this.path)
        stream.on('data', data => {
            reader(data.toString())
        })
    }

    read() {
        return fs.readFileSync(this.path).toString()
    }

    write(string) {
        let child = cp.exec('echo "' + string + '" > ' + this.path)
        this.children.push(child)
    }

    close() {
        this._killChildren()
        if (!this.preserve) {
            this._unlink()
        }
    }

    _killChildren() {
        this.children.map(child => child.kill())
    }

    _unlink() {
        fs.unlinkSync(this.path)
    }
}

module.exports = FIFO

