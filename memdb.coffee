createRBT         = require('functional-red-black-tree')
inherits          = require('inherits-ex')
AbstractNoSQL     = require('abstract-nosql')
AbstractIterator  = require('abstract-iterator')
Errors            = require('abstract-error')
NotFoundError     = Errors.NotFoundError
ltgt              = require('ltgt')
setImmediate      = global.setImmediate or process.nextTick


globalStore = {}

toKey = (key) ->
  if typeof key == 'string' then '$' + key else JSON.stringify(key)

gt  = (value) -> value > @_endValue
gte = (value) -> value >= @_endValue
lt  = (value) -> value < @_endValue
lte = (value) -> value <= @_endValue

class MemIterator
  inherits MemIterator, AbstractIterator

  constructor: (db, options) ->
    super db, options
    options = @options
    @_limit = options.limit
    if @_limit == -1
      @_limit = Infinity
    tree = db._store[db._location]
    @keyAsBuffer = options.keyAsBuffer == true
    @valueAsBuffer = options.valueAsBuffer == true
    @_reverse = options.reverse
    #this._options = options
    @_done = 0
    if !@_reverse
      @_incr = 'next'
      @_start = ltgt.lowerBound(options)
      @_endValue = ltgt.upperBound(options)
      if @_start == null
        @_tree = tree.begin
        # if options.gt == null
        #   @_tree.next()
      else if ltgt.lowerBoundInclusive(options)
        @_tree = tree.ge(@_start)
      else
        @_tree = tree.gt(@_start)
      if @_endValue
        if ltgt.upperBoundInclusive(options)
          @_test = lte
        else
          @_test = lt
    else
      @_incr = 'prev'
      @_start = ltgt.upperBound(options)
      @_endValue = ltgt.lowerBound(options)
      if @_start == null
        @_tree = tree.end
        # if options.lt == null
        #   @_tree.prev()
      else if ltgt.upperBoundInclusive(options)
        @_tree = tree.le(@_start)
      else
        @_tree = tree.lt(@_start)
      if @_endValue
        if ltgt.lowerBoundInclusive(options)
          @_test = gte
        else
          @_test = gt
    return

  _nextSync: () ->
    return false if @_done++ >= @_limit
    return false if !@_tree.valid
    key = @_tree.key
    value = @_tree.value
    return false unless @_test(key)

    key = new Buffer(key) if @keyAsBuffer
    value = new Buffer(value) if @valueAsBuffer
    @_tree[@_incr]()

    return [
      key
      value
    ]

  _test: -> true

module.exports = class MemDB
  inherits MemDB, AbstractNoSQL

  constructor: (location) ->
    return new MemDB(location) unless this instanceof MemDB
    super if typeof location == 'string' then location else ''
    @_location = if @location then toKey(@location) else '_tree'
    @_store = if @location then globalStore else this
    @_store[@_location] = @_store[@_location] or createRBT()
    return

  finalize: ->
    if @_store != this
      delete globalStore[@_location]
    return
  _openSync: -> true
  _putSync: (key, value, options) ->
    @_store[@_location] = @_store[@_location].remove(key).insert(key, value)
    true
  _isExistsSync: (key, options) ->
    result = @_store[@_location].get(key)
    if result == undefined
      result = false
    else
      result = true
    result

  _getSync: (key, options) ->
    value = @_store[@_location].get(key)
    # 'NotFound' error, consistent with LevelDOWN API
    throw new NotFoundError if value == undefined
    if options.asBuffer == true and !@_isBuffer(value)
      value = new Buffer(String(value))
    value

  _delSync: (key, options) ->
    @_store[@_location] = @_store[@_location].remove(key)
    true

  _batchSync: (array, options) ->
    i = -1
    len = array.length
    tree = @_store[@_location]
    while ++i < len
      if !array[i]
        continue
      key = if @_isBuffer(array[i].key) then array[i].key else String(array[i].key)
      err = @_checkKey(key, 'key')
      if err
        throw err
      tree = tree.remove(array[i].key)
      # we always remove as insert doesn't replace
      if array[i].type == 'put'
        value = if @_isBuffer(array[i].value) then array[i].value else String(array[i].value)
        err = @_checkKey(value, 'value')
        if err
          throw err
        tree = tree.insert(key, value)
    @_store[@_location] = tree
    true

  IteratorClass: MemIterator

  _isBuffer: (obj) -> Buffer.isBuffer obj

  @destroy: (name, callback) ->
    key = toKey(name)
    delete globalStore[key] if key of globalStore
    setImmediate callback
    return
