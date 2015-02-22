var test       = require('tape')

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
        return this._assert(thing instanceof t, message, extra)
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
