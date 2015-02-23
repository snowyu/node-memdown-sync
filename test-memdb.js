var test       = require('tape')
  , testCommon = require('abstract-nosql/testCommon')
  , MemDB    = require('./')
  , testBuffer = require('./testdata_b64')

module.exports.all = function (test, testCommon) {

//
// TODO: destroy() test copied from localstorage-down
// https://github.com/pouchdb/pouchdb/blob/master/lib/adapters/leveldb.js#L1019
// move this test to abstract-nosql
//

test('test .destroy', function (t) {
  var db = new MemDB('destroy-test')
  var db2 = new MemDB('other-db')
  db2.put('key2', 'value2', function (err) {
    t.notOk(err, 'no error')
    db.put('key', 'value', function (err) {
      t.notOk(err, 'no error')
      db.get('key', {asBuffer: false}, function (err, value) {
        t.notOk(err, 'no error')
        t.equal(value, 'value', 'should have value')
        db.close(function (err) {
          t.notOk(err, 'no error')
          db2.close(function (err) {
            t.notOk(err, 'no error')
            MemDB.destroy('destroy-test', function (err) {
              t.notOk(err, 'no error')
              var db3 = new MemDB('destroy-test')
              var db4 = new MemDB('other-db')
              db3.get('key', function (err, value) {
                t.ok(err, 'key is not there')
                db4.get('key2', {asBuffer: false}, function (err, value) {
                  t.notOk(err, 'no error')
                  t.equal(value, 'value2', 'should have value2')
                  t.end()
                })
              })
            })
          })
        })
      })
    })
  })
})

test('unsorted entry, sorted iterator', function (t) {
  var db = new MemDB('foo')
    , noop = function () {}
  db.open()
  db.put('f', 'F')
  db.put('a', 'A')
  db.put('c', 'C')
  db.put('e', 'E')
  db.batch([
      { type: 'put', key: 'd', value: 'D' }
    , { type: 'put', key: 'b', value: 'B' }
    , { type: 'put', key: 'g', value: 'G' }
  ])
  testCommon.collectEntries(db.iterator({ keyAsBuffer: false, valueAsBuffer: false }), function (err, data) {
    t.notOk(err, 'no error')
    t.equal(data.length, 7, 'correct number of entries')
    var expected = [
        { key: 'a', value: 'A' }
      , { key: 'b', value: 'B' }
      , { key: 'c', value: 'C' }
      , { key: 'd', value: 'D' }
      , { key: 'e', value: 'E' }
      , { key: 'f', value: 'F' }
      , { key: 'g', value: 'G' }
    ]
    t.deepEqual(data, expected)
    t.end()
  })
})

test('reading while putting', function (t) {
  var db = new MemDB('foo2')
    , noop = function () {}
    , iterator
  db.open()
  db.put('f', 'F')
  db.put('c', 'C')
  db.put('e', 'E')
  iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
  iterator.next(function (err, key, value) {
    t.equal(key, 'c')
    t.equal(value, 'C')
    db.put('a', 'A')
    iterator.next(function (err, key, value) {
      t.equal(key, 'e')
      t.equal(value, 'E')
      t.end()
    })
  })
})


test('reading while deleting', function (t) {
  var db = new MemDB('foo3')
    , noop = function () {}
    , iterator
  db.open()
  db.put('f', 'F')
  db.put('a', 'A')
  db.put('c', 'C')
  db.put('e', 'E')
  iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
  iterator.next(function (err, key, value) {
    t.equal(key, 'a')
    t.equal(value, 'A')
    db.del('a')
    iterator.next(function (err, key, value) {
      t.equal(key, 'c')
      t.equal(value, 'C')
      t.end()
    })
  })
})

test('reverse ranges', function(t) {
  var db = new MemDB('foo4')
    , noop = function () {}
    , iterator
  db.open(noop)
  db.put('a', 'A')
  db.put('c', 'C')
  iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false, start:'b', reverse:true })
  iterator.next(function (err, key, value) {
    t.equal(key, 'a')
    t.equal(value, 'A')
    t.end()
  })
})

test('no location', function(t) {
  var db = new MemDB()
    , noerr = function (err) {
      t.error(err, 'opens crrectly')
    }
    , noop = function () {}
    , iterator
  db.open(noerr)
  db.put('a', 'A')
  db.put('c', 'C')
  iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false, start:'b', reverse:true })
  iterator.next(function (err, key, value) {
    t.equal(key, 'a')
    t.equal(value, 'A')
    t.end()
  })
})

test('delete while iterating', function(t) {
  var db = new MemDB()
    , noerr = function (err) {
      t.error(err, 'opens crrectly')
    }
    , noop = function () {}
    , iterator
  db.open(noerr)
  db.put('a', 'A')
  db.put('b', 'B')
  db.put('c', 'C')
  iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false, start:'a' })
  iterator.next(function (err, key, value) {
    t.equal(key, 'a')
    t.equal(value, 'A')
    db.del('b', function (err) {
      t.notOk(err, 'no error')
      iterator.next(function (err, key, value) {
        t.notOk(err, 'no error');
        t.equals(key, 'b')
        t.equal(value, 'B')
        t.end()
      });
    })
  })
})
}

//module.exports.all(test, testCommon)
