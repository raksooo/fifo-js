const cp = require('child_process'),
      fs = require('fs'),
      FIFOError = require('./fifoError')

class FIFO {
    constructor(path) {
        this.path = path || this._generateFifoPath()

        this._initFifo()
        this._open = true
    }

    get open() {
        return this._open && this._pathExists()
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

    setReader(reader) {
        this._throwIfClosed()

        this.reader = reader
        this._reader()
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
        this._open = false

        if (!this.preserve) {
            this._unlink()
        }
    }

    _initFifo() {
        let stat = this._pathExists()
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

    _pathExists(path) {
        path = path || this.path
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
        } while (this._pathExists(path))

        return path
    }

    _reader() {
        fs.readFile(this.path, (err, data) => {
            if (this.open) {
                this.reader && this.reader(data.toString().trim())
                this._reader()
            }
        })
    }

    _unlink() {
        if (this._pathExists()) {
            fs.unlinkSync(this.path)
        }
    }

    _throwIfClosed() {
        if (!this.open) {
            throw new FIFOError(this.path, "Fifo isn't open.")
        }
    }
}

module.exports = FIFO

