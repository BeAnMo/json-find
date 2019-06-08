"use strict";

var _documentAt = require("./documentAt");

var _DOCUMENT;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DOCUMENT = (_DOCUMENT = {}, _defineProperty(_DOCUMENT, Symbol.iterator, function () {
  return fold_bf_gen(this, this.config.delimeter, this.config.onlyPrimitives);
}), _defineProperty(_DOCUMENT, "at", function at(key) {
  var maybeUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var path = key.split(this.config.delimeter);

  if (maybeUpdate !== undefined) {
    return (0, _documentAt.setDoc)(this, path, maybeUpdate);
  } else {
    return (0, _documentAt.getDoc)(this, path);
  }
}), _defineProperty(_DOCUMENT, "fold", function fold(proc, accum) {
  var acc = accum;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _step.value,
          value = _step$value.value,
          key = _step$value.key,
          _path = _step$value.path;
      acc = proc(acc, value, key, _path);
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

  return acc;
}), _defineProperty(_DOCUMENT, "prune", function prune(predicate) {
  var result = Doc({}, this.config);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _step2.value,
          value = _step2$value.value,
          key = _step2$value.key,
          _path2 = _step2$value.path;

      if (predicate(value, key, _path2)) {
        result.set(_path2, value);
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

  return result;
}), _defineProperty(_DOCUMENT, "transform", function transform(proc) {
  var result = Doc({}, this.config);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _step3.value,
          value = _step3$value.value,
          key = _step3$value.key,
          _path3 = _step3$value.path;
      result.set(_path3, proc(value, key, _path3));
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
}), _defineProperty(_DOCUMENT, "each", function each(proc) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _step4.value,
          value = _step4$value.value,
          key = _step4$value.key,
          _path4 = _step4$value.path;
      proc(value, key, _path4);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return this;
}), _defineProperty(_DOCUMENT, "orAll", function orAll(predicate) {
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = this[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var _step5$value = _step5.value,
          value = _step5$value.value,
          key = _step5$value.key,
          _path5 = _step5$value.path;

      if (predicate(value, key, _path5)) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
        _iterator5["return"]();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  return false;
}), _defineProperty(_DOCUMENT, "andAll", function andAll(predicate) {
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var _step6$value = _step6.value,
          value = _step6$value.value,
          key = _step6$value.key,
          _path6 = _step6$value.path;

      if (!predicate(value, key, _path6)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
        _iterator6["return"]();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return true;
}), _defineProperty(_DOCUMENT, "smoosh", function smoosh() {
  var result = Doc({}, this.config);
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var _step7$value = _step7.value,
          value = _step7$value.value,
          _path7 = _step7$value.path;
      result.set(_path7, value);
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
        _iterator7["return"]();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  return result;
}), _defineProperty(_DOCUMENT, "count", function count(predicate) {
  var C = 0;
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var _step8$value = _step8.value,
          value = _step8$value.value,
          key = _step8$value.key;

      if (predicate(value, key, path)) {
        C += 1;
      }
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
        _iterator8["return"]();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return C;
}), _DOCUMENT);

function Doc(any, _ref) {
  var _ref$onlyPrimitives = _ref.onlyPrimitives,
      onlyPrimitives = _ref$onlyPrimitives === void 0 ? true : _ref$onlyPrimitives,
      _ref$onlyJson = _ref.onlyJson,
      onlyJson = _ref$onlyJson === void 0 ? true : _ref$onlyJson,
      _ref$delimeter = _ref.delimeter,
      delimeter = _ref$delimeter === void 0 ? '.' : _ref$delimeter;
  return Object.assign(Object.create(DOCUMENT, {
    config: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: {
        onlyPrimitives: onlyPrimitives,
        onlyJson: onlyJson,
        delimeter: delimeter
      }
    }
  }), any);
}