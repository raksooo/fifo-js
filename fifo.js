const cp = require('child_process'),
      fs = require('fs'),
      FIFOError = require('./fifoError')

class FIFO {
    constructor(path) {
        this.path = path || this._generateFifoPath()

        this._children = []
        this._initFifo()
        this._open = true
    }

    get open() {
        return this._open && this._pathExists()
    }

    read(callback) {
        this._throwIfClosed()

        let cmd = this._generateReadCommand()
        let child = cp.exec(cmd, (err, stdout, stderr) => {
            callback && callback(stdout)
        })
        this._children.push(child)
    }

    readSync() {
        this._throwIfClosed()

        let cmd = this._generateReadCommand()
        return cp.execSync(cmd).toString()
    }

    setReader(callback) {
        this._throwIfClosed()

        let cmd = this._generateReadCommand()
        let child = cp.exec(cmd, (err, stdout, stderr) => {
            this.setReader(callback)
            callback && callback(stdout)

            let index = this._children.indexOf(child)
            this._children = this._children.splice(index, 1)
        })
        this._children.push(child)
    }

    write(string, callback) {
        this._throwIfClosed()

        let cmd = this._generateWriteCommand(string)
        let child = cp.exec(cmd, () => callback && callback())
        this._children.push(child)
    }

    writeSync(string) {
        this._throwIfClosed()

        let cmd = this._generateWriteCommand(string)
        cp.execSync(cmd)
    }

    close() {
        this._open = false

        this._killAllChildren()
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

    _generateWriteCommand(string) {
        return 'echo -n "' + string + '" > ' + this.path
    }

    _generateReadCommand() {
        return 'cat ' + this.path
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

    _unlink() {
        if (this._pathExists()) {
            fs.unlinkSync(this.path)
        }
    }

    _killAllChildren() {
        this._children.forEach(child => child.kill())
    }

    _throwIfClosed() {
        if (!this.open) {
            throw new FIFOError(this.path, "Fifo isn't open.")
        }
    }
}

module.exports = FIFO

