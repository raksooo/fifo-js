const cp = require('child_process'),
      fs = require('fs'),
      FifoException = require('./fifoException')

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
        let path
        do {
            let random = Math.floor(Math.random() * 8999 + 1000)
            path = '/tmp/fifo-js-' + random + '.fifo'
        } while (this._statSafe(path))

        return path
    }

    setReader(reader) {
        this.throwIfOpen()

        let stream = fs.createReadStream(this.path)
        stream.on('data', data => {
            reader(data.toString())
        })
    }

    read(callback) {
        this.throwIfOpen()

        return fs.readFile(this.path, (err, data) => {
            callback && callback(data.toString())
        })
    }

    /**
     * Warning: Doesn't work in combination with fifo.write() since this locks
     * up the node process.
     */
    readSync() {
        this.throwIfOpen()

        return fs.readFileSync(this.path).toString()
    }

    write(string, callback) {
        this.throwIfOpen()

        let writer = fs.createWriteStream(this.path, { autoClose: true })
        writer.end(...arguments)
    }

    writeSync(string) {
        this.throwIfOpen()

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

    throwIfOpen() {
        if (!this.open) {
            throw new FifoException(this.path, "Fifo isn't open.")
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

