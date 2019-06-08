"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fold = fold;

var _utils = require("../utils");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(fold_bf_gen);

/**
 * @description Mimicks Array.reduce, but can iterate over
 * Array & Objects.
 */
function fold(accum, collection, fn) {
  // converts array indexes to [...String]
  // eliminates need to check type
  // ...though if accum is an Array, could
  // be optimized with Array.push
  // Alternatively, if an Object has not prototype
  // could use for..in for both Object/Array
  var keys = Object.keys(collection);
  var acc = accum;

  for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
    var key = _keys[_i];
    acc = fn(acc, collection[key], key);
  }

  return acc;
}

function fold_bf(collection, proc, accum) {
  var queue = Queue();

  var pushMany = function pushMany(path, keys) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        queue.push("".concat(path).concat(key));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  pushMany('', Object.keys(collection));

  while (!queue.isEmpty()) {
    var path = queue.pop();
    var itemAtPath = getAt(collection, path);

    if ((0, _utils.isCompound)(itemAtPath)) {
      pushMany("".concat(path, "."), Object.keys(itemAtPath));
    } else {
      accum = proc(accum, itemAtPath, path);
    }
  }

  return accum;
}
/**
 * function Doc(obj){
  return {
    ...obj,
    [Symbol.iterator](){
      return fold_bf_gen(this)
    }
  }
}
 */


function fold_bf_gen(collection) {
  var delim,
      queue,
      pushMany,
      path,
      itemAtPath,
      isCollection,
      _args = arguments;
  return regeneratorRuntime.wrap(function fold_bf_gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          delim = _args.length > 1 && _args[1] !== undefined ? _args[1] : '.';
          queue = Queue();

          pushMany = function pushMany(path, keys) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;
                var keyPath = "".concat(path).concat(key);

                if (false) {
                  // check for cyclic ref
                  console.warn("circular reference @".concat(keyPath));
                } else {
                  queue.push(keyPath);
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          };

          pushMany('', Object.keys(collection));

        case 4:
          if (queue.isEmpty()) {
            _context.next = 13;
            break;
          }

          path = queue.pop();
          itemAtPath = getAt(collection, path);
          isCollection = (0, _utils.isCompound)(itemAtPath);

          if (isCollection) {
            pushMany("".concat(path, "."), Object.keys(itemAtPath));
          }

          _context.next = 11;
          return {
            path: path,
            key: path.split(delim).slice(-1)[0],
            value: itemAtPath,
            isCollection: isCollection
          };

        case 11:
          _context.next = 4;
          break;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function Queue() {
  var q = [];
  var len = 0;
  var self = {
    push: function push(item) {
      len = q.push(item);
      return self;
    },
    pop: function pop() {
      if (len === 0) {
        return null;
      } else {
        var _q = q,
            _q2 = _toArray(_q),
            first = _q2[0],
            rest = _q2.slice(1);

        q = rest;
        len -= 1;
        return first;
      }
    },
    isEmpty: function isEmpty() {
      return len === 0;
    }
  };
  return self;
}

function getAt(collection, path) {
  var delim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var splitPath = path.split(delim);
  var result = collection;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = splitPath[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var p = _step3.value;
      result = result[p];

      if (result === undefined) {
        return result;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return result;
}