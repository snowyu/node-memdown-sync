var test       = require('tape')
  , testCommon = require('abstract-nosql/testCommon')
  , MemDOWN    = require('./')
  //, Encoding   = require('nosql-encoding')
  //, AbstractIterator = require('./').AbstractIterator
  , testBuffer = require('./testdata_b64')

require('./tape-type-patch')

//MemDOWN=Encoding(MemDOWN)
/*** compatibility with basic LevelDOWN API ***/

// meh require('abstract-nosql/abstract/leveldown-test').args(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/open-test').args(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/open-test').open(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/del-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/isExists-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/get-test').all(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/getbuffer-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/mget-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/put-get-del-test').all(MemDOWN, test, testCommon, testBuffer)

require('abstract-nosql/abstract/batch-test').all(MemDOWN, test, testCommon)
require('abstract-nosql/abstract/chained-batch-test').all(MemDOWN, test, testCommon)

require('abstract-nosql/abstract/close-test').close(MemDOWN, test, testCommon)

require('abstract-iterator/abstract/iterator-test').all(MemDOWN, test, testCommon)

require('abstract-iterator/abstract/ranges-test').all(MemDOWN, test, testCommon)

require('./test-memdb.js').all(test, testCommon)

require('./test-event.js')
