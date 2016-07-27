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
```Javascript
fifo.read(text => {
    // text contains the text which was read from the fifo.
})

let text = fifo.readSync()
```
Warning: readSync locks up the node process which places it in a deadlock. This
can only be used if the write takes place outside of this process, i.e. you
cannot use it in combination with the write function in the same fifo object.


### Listener
This function will read until the fifo is closed.
```Javascript
fifo.setReader(text => {
    // text contains the text which was read from the fifo.
})
```

### Write
```Javascript
fifo.write(text, () => {
    // The written text has been read.
})

fifo.writeSync(text)
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

