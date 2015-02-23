### Nosql MemDB [![Build Status](https://img.shields.io/travis/snowyu/node-nosql-memdb/master.svg)](http://travis-ci.org/snowyu/node-nosql-memdb) [![npm](https://img.shields.io/npm/v/nosql-memdb.svg)](https://npmjs.org/package/nosql-memdb) [![downloads](https://img.shields.io/npm/dm/nosql-memdb.svg)](https://npmjs.org/package/nosql-memdb) [![license](https://img.shields.io/npm/l/nosql-memdb.svg)](https://npmjs.org/package/nosql-memdb) 


## Chnages

### v2.1.x

+ [events-ex](https://github.com/snowyu/events-ex.js): hooked eventable ability.

### v2.x.x

+ the modularization(feature plugin) with [abstract-nosql](https://github.com/snowyu/node-abstract-nosql)
  * [nosql-stream](https://github.com/snowyu/node-nosql-stream): streamable ability. you need implement the [AbstractIterator](https://github.com/snowyu/node-abstract-iterator).
  * [nosql-encoding](https://github.com/snowyu/node-nosql-encoding): key/value encoding ability.

- (`broken changes`) remove the streamable feature from buildin. this is a plugin now.
- (`broken change`) defaults to disable asBuffer option.
  * pls use the `getBuffer` method to get as buffer.

### v1.x.x

+ Add the AbstractError and error code supports.
+ Add the synchronous methods supports.
* see [abstract-nosql](https://github.com/snowyu/node-abstract-nosql) to more details.

## Example

```js
var streamable = require('nosql-stream')
var eventable  = require('events-ex/eventable')
var MemDB = eventable(streamable(require('nosql-memdb')))
var db = MemDB()

//eventable ability:
db.on('put', function(key, value){
    console.log('put:', key, value)
})

db.open()

db.put('name', 'Yuri Irsenovich Kim')
db.put('dob', '16 February 1941')
db.put('spouse', 'Kim Young-sook')
db.put('occupation', 'Clown')

//streamable ability:
db.readStream()
  .on('data', console.log)
  .on('close', function () { console.log('Show\'s over folks!') })
```

Note in this example we're not even bothering to use callbacks on our `.put()` methods even though they are async. We know that MemDOWN operates immediately so the data will go straight into the store.

Running our example gives:

```
{ key: 'dob', value: '16 February 1941' }
{ key: 'name', value: 'Yuri Irsenovich Kim' }
{ key: 'occupation', value: 'Clown' }
{ key: 'spouse', value: 'Kim Young-sook' }
Show's over folks!
```

## Licence

MemDOWN is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
Nosql-MemDB is Copyright (c) 2015 Riceball LEE [@riceball](https://github.com/snowyu) and its contributors.

