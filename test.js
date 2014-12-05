var test       = require('tape')
  , testCommon = require('abstract-nosql/testCommon')
  , MemDOWN    = require('./')
  //, AbstractIterator = require('./').AbstractIterator
  , testBuffer = require('./testdata_b64')

/*** compatibility with basic LevelDOWN API ***/

// meh require('abstract-nosql/abstract/leveldown-test').args(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/open-test').args(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/open-test').open(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/del-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/get-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-get-del-test').all(MemDOWN, test, testCommon, testBuffer)

require('abstract-nosql/abstract/batch-test').all(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/chained-batch-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/close-test').close(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/iterator-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/ranges-test').all(MemDOWN, test, testCommon)

require('./test-memDOWN.js').all(test, testCommon)

