var test       = require('tape')
  , util       = require('abstract-object')
  , testCommon = require('abstract-nosql/testCommon')
  , MemDOWN    = require('./')
  //, AbstractIterator = require('./').AbstractIterator
  , testBuffer = require('./testdata_b64')

/*** compatibility with basic LevelDOWN API ***/

// meh require('abstract-nosql/abstract/leveldown-test').args(MemDOWN, test, testCommon)

if (!test.Test.prototype.type) {
  test.Test.prototype.type = function(thing, t, message, extra) {
    var name = t
    if (typeof name === "function") name = name.name || "(anonymous ctor)"
    //console.error("name=%s", name)
    message = message || "type is "+name
    var type = typeof thing
    //console.error("type=%s", type)
    if (!thing && type === "object") type = "null"
    if (type === "object" && t !== "object") {
      if (typeof t === "function") {
        //console.error("it is a function!")
        extra = extra || {}
        extra.found = Object.getPrototypeOf(thing).constructor.name
        extra.wanted = name
        //console.error(thing instanceof t, name)
        return assert.ok(thing instanceof t, message, extra)
      }

      //console.error("check prototype chain")
      // check against classnames or objects in prototype chain, as well.
      // type(new Error("asdf"), "Error")
      // type(Object.create(foo), foo)
      var p = thing
      while (p = Object.getPrototypeOf(p)) {
        if (p === t || p.constructor && p.constructor.name === t) {
          type = name
          break
        }
      }
    }
    this._assert(type === name, {
        message : message,
        operator : 'type',
        expected : name,
        actual : type,
        extra : extra
    });
  }
}
require('abstract-nosql/abstract/open-test').args(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/open-test').open(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/del-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/isExists-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/get-test').all(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/mget-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-get-del-test').all(MemDOWN, test, testCommon, testBuffer)

require('abstract-nosql/abstract/batch-test').all(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/chained-batch-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/close-test').close(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/iterator-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/ranges-test').all(MemDOWN, test, testCommon)

require('./test-memDOWN.js').all(test, testCommon)

