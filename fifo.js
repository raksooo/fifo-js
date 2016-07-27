const cp = require('child_process'),
      fs = require('fs'),
      FIFOError = require('./fifoError')

class FIFO {
    constructor(path) {
        this.path = path || this._generateFifoPath()

        this._initFifo()
        this.open = true
    }

    _initFifo() {
        let stat = this._statSafe(this.path)
        if (!stat) {
            this._createFifo()
        } else if (!stat.isFIFO()) {
            throw new FIFOError(this.path,
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
        let path
        do {
            let random = Math.floor(Math.random() * 8999 + 1000)
            path = '/tmp/fifo-js-' + random + '.fifo'
        } while (this._statSafe(path))

        return path
    }

    setReader(reader) {
        this._throwIfClosed()

        this.reader = reader
        this._reader()
    }

    _reader() {
        fs.readFile(this.path, (err, data) => {
            if (this.open) {
                this.reader && this.reader(data.toString().trim())
                this._reader()
            }
        })
    }

    read(callback) {
        this._throwIfClosed()

        fs.readFile(this.path, (err, data) => {
            if (this.open && callback) {
                callback(data.toString().trim())
            }
        })
    }

    /**
     * Warning: Doesn't work in combination with fifo.write() since this locks
     * up the node process.
     */
    readSync() {
        this._throwIfClosed()

        return fs.readFileSync(this.path).toString().trim()
    }

    write(string, callback) {
        this._throwIfClosed()

        let writer = fs.createWriteStream(this.path, { autoClose: true })
        writer.end(string, () => {
            if (this.open && callback) {
                callback()
            }
        })
    }

    writeSync(string) {
        this._throwIfClosed()

        let child = cp.execSync('echo "' + string + '" > ' + this.path)
        return string
    }

    close() {
        this.open = false

        if (!this.preserve) {
            this._unlink()
        }
    }

    _unlink() {
        if (this._statSafe(this.path)) {
            fs.unlinkSync(this.path)
        }
    }

    _throwIfClosed() {
        if (!this.open) {
            throw new FIFOError(this.path, "Fifo isn't open.")
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

