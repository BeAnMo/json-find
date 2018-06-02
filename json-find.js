/* 
    JSON-Find
Small utility for searching through JSON or a JSON-compatible object for values at
given keys.  
*/

'use strict';

/**** JSON document ***
 "this" assumes an Object or Array */
var JSON_DATA = Object.create(null, {
  checkKey: {
    configurable: false,
    enumerable: false,
    /* object at given key or false */
    value: function(key) {
      return _checkKey(this, key);
    }
  },
  findValues: {
    configurable: false,
    enumerable: false,
    /* object at given key or false */
    value: function(keys) {
      var _keys = toArgs(arguments);

      return _findValues(this, _keys);
    }
  },
  extractPaths: {
    configurable: false,
    enumerable: false,
    /* extract objects at given paths */
    value: function(allKeys) {
      var _args = toArgs(arguments);
      var newKeysToAssign = _args[0];
      var paths = _args.slice(1);

      return extractPaths(this, newKeysToAssign, paths);
    }
  }
});

/*** Constructor *** 
        JsonFind will return Atoms as is, Arrays & Objects are
        converted to JsonFind Object */
function JsonFind(doc) {
  if (isAtom(doc) || doc === null) {
    return doc;
  } else {
    var possibleJson = JSON.stringify(doc);

    if (possibleJson === undefined) {
      throw new Error('Object is invalid JSON');
    } else {
      return Object.assign(Object.create(JSON_DATA), doc);
    }
  }
}

JsonFind.prototype = JSON_DATA;

module.exports = JsonFind;

/***** JSON_DATA methods *****/
/**
 * json,
 * keys: [...String],
 * breakCond: String, X -> Boolean,
 * onKey: String, X -> Y,
 * done: ...
 */
function traverseJson(conf) {
  var json = conf.json;
  var keys = conf.keys;
  var onKey = conf.onKey;
  var done = conf.done;

  var searchesLen = keys.length;
  var searches = {};
  var shouldBreak = false;

  /* build dictionary */
  for (var i = keys.length - 1; i >= 0; i--) {
    searches[keys[i]] = true;
  }

  /* Object, Object -> Void */
  function traverseObject(toSearchObj, searchForObj) {
    var currentKeys = Object.keys(toSearchObj);
    var len = currentKeys.length;
    var i = 0;

    while (i < len && !shouldBreak) {
      var key = currentKeys[i];
      var val = toSearchObj[key];

      if (searchForObj[key]) {
        shouldBreak = onKey(key, val);
      } else if (isObject(val)) {
        traverseObject(val, searchForObj);
      } else if (isArray(val)) {
        traverseArray(val, searchForObj);
      }

      i++;
    }
  }

  /* Array, Object -> Void */
  function traverseArray(arr, searchForObj) {
    var len = arr.length;
    var i = 0;

    while (i < len && !shouldBreak) {
      var item = arr[i];

      if (isArray(item)) {
        traverseArray(item, searchForObj);
      } else if (isObject(item)) {
        traverseObject(item, searchForObj);
      }

      i++;
    }
  }

  traverseObject(json, searches);

  return done();
}

function _checkKey(json, key) {
  var acc = false;

  return traverseJson({
    json: json,
    keys: [key],
    onKey: function(k, v) {
      acc = v;

      return acc;
    },
    done: function() {
      return acc;
    }
  });
}

function _findValues(json, keys) {
  var L = keys.length;
  var notRetrieved = keys.slice(0);
  var acc = {};

  return traverseJson({
    json: json,
    keys: keys,
    onKey: function(k, v) {
      notRetrieved = notRetrieved.filter(function(key) {
        return key !== k;
      });

      if (!acc[k]) {
        acc[k] = v;
      }

      return notRetrieved.length === 0;
    },
    done() {
      return acc;
    }
  });
}

/* Object, [...String]|False, [...[...String]] -> Object 
        extracts values from an object from multiples paths: 
        a Path is [...String] 
        assumes newKeys is false or [...String] */
function extractPaths(obj, newKeys, paths) {
  var nkLen = newKeys.length;
  var pLen = paths.length;

  var curried = curry(assignKeysAtPaths, obj, newKeys, paths);

  return nkLen > pLen ? curried(nkLen) : curried(pLen);
}

/*** Helpers ***/

/* JSON, [...String], [...[...String]], Number -> Object */
function assignKeysAtPaths(obj, newKeys, paths, loopLen) {
  var result = {};

  for (var i = 0; i < loopLen; i++) {
    // allows for unequal newKeys/paths lengths
    var iPath = paths[i] ? paths[i] : null;
    var iNewKey = newKeys[i] ? newKeys[i] : paths[i].slice(-1);

    var objAtPath = iPath === null ? null : recurPath(obj, iPath);
    var key = objAtPath ? Object.keys(objAtPath)[0] : null;

    var curried = curry(Object.assign, result);

    // prevent same keys from overriding
    if (newKeys) {
      if (objAtPath) {
        curried({ [iNewKey]: objAtPath[key] });
      } else {
        curried({ [iNewKey]: objAtPath });
      }
    } else if (key in result) {
      curried({ [key + '+' + i]: objAtPath[key] });
    } else {
      curried(objAtPath);
    }
  }

  return result;
}

/* Object, Array-of-String -> Object
        retrieves the value of an object at the given path
        returns { String-X: object }
        where String-X is the key from the last index of 
        the given array */
function recurPath(obj, arr, lastKey = '') {
  if (arr.length === 0) {
    return { [lastKey]: obj };
  } else {
    return recurPath(obj[arr[0]], arr.slice(1), arr[0]);
  }
}

/* [[...X -> Y], ...X -> [...Y -> Z]] -> Z */
function curry(args) {
  var _args = toArgs(arguments);
  var fn = _args[0];
  var firstArgs = _args.slice(1);

  return function(args2) {
    var secondArgs = toArgs(arguments);

    return fn.apply(null, firstArgs.concat(secondArgs));
  };
}

function isAtom(v) {
  return (
    null === v ||
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'string'
  );
}

function isArray(v) {
  return Array.isArray(v);
}

function isObject(v) {
  return typeof v === 'object' && !isArray(v);
}

function isNull(v) {
  return null === v ? 'null' : v;
}

function isCompound(v) {
  return isArray(v) || isObject(v);
}

function isKey(json, searchFor) {
  return json === null ? false : isCompound(json) && searchFor in json;
}

function toArgs(args) {
  return Array.prototype.slice.call(args);
}
