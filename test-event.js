const tap                  = require('tape')
    , testCommon           = require('abstract-nosql/testCommon')
    , eventable            = require('events-ex/eventable')
    , MemDB                = eventable(require('./'))

require('./tape-type-patch')
require('abstract-nosql/abstract/event-test').all(MemDB, tap.test, testCommon)
