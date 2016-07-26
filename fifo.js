const cp = require('child_process'),
      fs = require('fs'),
      FifoException = require('./fifoException')

class FIFO {
    constructor(path) {
        this.path = path || this._generateFifoPath()
        this.children = []

        this._initFifo()
        this.open = true
    }

    _initFifo() {
        let stat = this._statSafe(this.path)
        if (!stat) {
            this._createFifo()
        } else if (!stat.isFIFO()) {
            throw new FifoException(this.path,
                    "Non fifo file with this name already exists.")
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
        if (this.open) {
            let stream = fs.createReadStream(this.path)
            stream.on('data', data => {
                reader(data.toString())
            })
        }
    }

    read() {
        if (this.open) {
            return fs.readFileSync(this.path).toString()
        }
    }

    write(string) {
        if (this.open) {
            let child = cp.exec('echo "' + string + '" > ' + this.path)
            this.children.push(child)
        }
    }

    close() {
        this.open = false
        this._killChildren()
        if (!this.preserve) {
            this._unlink()
        }
    }

    _killChildren() {
        this.children.forEach(child => child.kill())
    }

    _unlink() {
        if (this._statSafe(this.path)) {
            fs.unlinkSync(this.path)
        }
    }

    get open() {
        return this._open && this._statSafe(this.path)
    }

    set open(value) {
        this._open = value
    }
}

module.exports = FIFO

