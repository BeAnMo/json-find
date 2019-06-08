"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDoc = setDoc;
exports.getDoc = getDoc;

/**
 * @description Mutates the given document
 * at the path with val.
 *
 * @param {Object} doc
 * @param {[String]} path
 * @param {Object} val
 */
function setDoc(doc, path, val) {
  var cursor = doc;
  var index = 0;

  while (path[index + 1]) {
    var next = path[index]; // need to maintain arrays

    if (cursor[next] === undefined) {
      cursor = cursor[next] = isNaN(next) ? {} : [];
    } else {
      cursor = cursor[next];
    }

    index++;
  }

  cursor[path[index]] = val;
  return doc;
}
/**
 * @description Retrieves the value of the document
 * at the given path.
 *
 * @param {Object} doc
 * @param {[String]} path
 */


function getDoc(doc, path) {
  var cursor = doc;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var next = _step.value;
      cursor = cursor[next];
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

  return cursor;
}