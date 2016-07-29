# FIFO.js
Node.js module provides a class which handles a fifo file.

npm: https://www.npmjs.com/package/fifo-js

## Installation
```sh
npm install fifo-js
```

## Usage
### Example
```Javascript
const FIFO = require('fifo-js')

let fifo = new FIFO()

fifo.read(console.log.bind(console))

fifo.write('foo')

fifo.close()
```

### Create fifo
The constructor creates a new fifo in /tmp/ if a path isn't provided. If a path
is provided and there's an existing fifo with that name it uses that one.
Otherwise it creates a new one with that name.
```Javascript
let fifo = new FIFO([path])
```

### Read
#### Asynchronous
```Javascript
fifo.read(callback)

callback:Function(data:String)
```

#### Synchronous
```Javascript
fifo.readSync()
```

#### Example
```Javascript
fifo.read(text => {
    // 'text' contains the text which was read from the fifo.
})

let text = fifo.readSync()
// 'text' contains the text which was read from the fifo.
```

### Listener
This function will read and call the callback for each message until the fifo
is closed. If read or readSync is called after a reader is set a FIFOError is
thrown.
```Javascript
fifo.setReader(text => {
    // 'text' contains the text which was read from the fifo.
})
```

### Write
When writing the boolean flag 'trim' can be supplied. This prevents a
trailing new line to be added.

#### Asynchronous
```Javascript
fifo.write(data:String, trim:Boolean, callback:Function())
```

#### Synchronous
```Javascript
fifo.writeSync(data:String, trim:Boolean)
```

#### Example
```Javascript
fifo.write(text, () => {
    // The written text has been read.
})

fifo.writeSync(text, true)
// The written text has been read.
```

### Close
```Javascript
fifo.close()
```

## Contact
* http://oskarnyberg.com
* oskar@oskarnyberg.com

## Licence
MIT: https://opensource.org/licenses/MIT

