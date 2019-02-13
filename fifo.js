const cp = require('child_process'),
      fs = require('fs'),
      FIFOError = require('./fifoError')

class FIFO {
    constructor(path, encoding) {
        this.path = path || this._generateFifoPath()
        this.encoding = encoding || "utf8"

        this._children = []
        this._initFifo()
        this._open = true
    }

    get open() {
        return this._open && this._pathExists()
    }

    read(callback) {
        this._throwIfClosed()
        this._throwIfReader()

        let cmd = this._generateReadCommand()
        let child = cp.exec(cmd, {
              encoding: this.encoding
        }, (err, stdout, stderr) => {
            if (this.open && callback) {
                callback(stdout)
            }
        })
        this._children.push(child)
    }

    readSync() {
        this._throwIfClosed()
        this._throwIfReader()

        let cmd = this._generateReadCommand()
        return cp.execSync(cmd, {
              encoding: this.encoding
        })
    }

    setReader(callback) {
        this._throwIfClosed()
        this._throwIfReader()

        this.reader = true
        this._reader(callback)
    }

    removeReader() {
        this.reader = false
        this._readerChild.kill()
        delete this._readerChild
    }

    write(string, trim, callback) {
        if (typeof trim === 'function') {
            callback = trim
            trim = false
        }
        this._throwIfClosed()

        let cmd = this._generateWriteCommand(string, trim)
        let child = cp.exec(cmd, {
              encoding: this.encoding
        }, () => {
            if (this.open && callback) {
                callback()
            }
        })
        this._children.push(child)
    }

    writeSync(string, trim) {
        this._throwIfClosed()

        let cmd = this._generateWriteCommand(string, trim)
        cp.execSync(cmd)
    }

    close() {
        if (this._open) {
            this._open = false

            this._killAllChildren()
            if (!this.preserve) {
                this._unlink()
            }
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

    _generateFifoPath() {
        let path
        do {
            let random = Math.floor(Math.random() * 8999 + 1000)
            path = '/tmp/fifo-js-' + random + '.fifo'
        } while (this._pathExists(path))

        return path
    }

    _generateWriteCommand(string, trim) {
        return 'echo' + (trim ? ' -n' : '') + ' "' + string + '" > ' + this.path
    }

    _generateReadCommand() {
        return 'cat ' + this.path
    }

    _reader(callback) {
        let cmd = this._generateReadCommand()
        let child = cp.exec(cmd, {
              encoding: this.encoding
        }, (err, stdout, stderr) => {
            if (this.reader && this.open && callback) {
                this._reader(callback)
                callback(stdout)
            }
        })
        this._readerChild = child
    }

    _killAllChildren() {
        this._readerChild && this._readerChild.kill()
        this._children.forEach(child => child.kill())
    }

    _pathExists(path) {
        path = path || this.path
        try {
            return fs.statSync(path)
        } catch(e) {
            return false
        }
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

    _throwIfReader() {
        if (this.reader) {
            throw new FIFOError(this.path,
                    'Cannot read or set another reader if a reader is set.')
        }
    }
}

module.exports = FIFO

