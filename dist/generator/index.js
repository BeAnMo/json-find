"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fold_bf_gen = fold_bf_gen;

var _utils = require("../utils");

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(fold_bf_gen);

/**
 * @param {Object} collection
 * @param {String} delim
 * @param {Boolean} onlyPrimitives
 */
function fold_bf_gen(collection, delim, onlyPrimitives) {
  var queue, pushMany, path, itemAtPath, isCollection;
  return regeneratorRuntime.wrap(function fold_bf_gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          queue = (0, _utils.Queue)();

          pushMany = function pushMany(path, keys) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;
                var keyPath = "".concat(path).concat(key);

                if (false) {
                  // check for cyclic ref
                  console.warn("circular reference @".concat(keyPath));
                } else {
                  queue.push(keyPath);
                }
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

        case 3:
          if (queue.isEmpty()) {
            _context.next = 13;
            break;
          }

          path = queue.pop();
          itemAtPath = at(collection, path);
          isCollection = (0, _utils.isCompound)(itemAtPath);

          if (isCollection) {
            pushMany("".concat(path).concat(delim), Object.keys(itemAtPath));
          }
          /**
           * only prim AND is a collection - no yield
           * negated:
           * NOT only prim OR is NOT a collection - yield
           */


          if (!(!onlyPrimitives || !isCollection)) {
            _context.next = 11;
            break;
          }

          _context.next = 11;
          return {
            path: path,
            key: path.split(delim).slice(-1)[0],
            value: itemAtPath,
            isCollection: isCollection
          };

        case 11:
          _context.next = 3;
          break;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function at(collection, path, delim) {
  var splitPath = path.split(delim);
  var result = collection;
  var index = 0;

  while (splitPath[index]) {
    result = result[splitPath[index]];

    if (result === undefined) {
      return result;
    }
  }

  return result;
}