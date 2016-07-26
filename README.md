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

fifo.setReader(console.log.bind(console))

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
let content = fifo.read()
```

### Listener
```Javascript
fifo.setReader(callback)
```

### Write
```Javascript
fifo.write(string)
```

### Close
```Javascript
fifo.close()
```

## Todo
* Add methods read, readSync, write, writeSync.
* Write tests.

## Contact
* http://oskarnyberg.com
* oskar@oskarnyberg.com

## Licence
MIT: https://opensource.org/licenses/MIT

