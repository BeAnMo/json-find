"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findValues;

var _utils = require("../utils");

/**
 * @description Searches through an object for all given keys and
 * returns an object of the given keys & their values
 *
 * @param {String} toSearch
 * @param {String} searchFor
 *
 * @return {{[String]: Object }}
 */
function findValues(toSearch) {
  for (var _len = arguments.length, searchFor = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    searchFor[_key - 1] = arguments[_key];
  }

  var searchesLen = searchFor.length;
  var results = {};
  var searches = {};

  for (var i = 0; i < searchesLen; i++) {
    searches[searchFor[i]] = true;
  }
  /* Object, Object -> Void */


  function traverseObject(toSearchObj, searchForObj) {
    var allKeys = Object.keys(toSearchObj);
    var len = allKeys.length;

    for (var _i = 0; _i < len; _i++) {
      var key = allKeys[_i];
      var val = toSearchObj[key];

      if (searchForObj[key] && !results[key]) {
        results[key] = val;
      } else if ((0, _utils.isObject)(val)) {
        traverseObject(val, searchForObj);
      } else if ((0, _utils.isArray)(val)) {
        traverseArray(val, searchForObj);
      }
    }
  }
  /* Array, Object -> Void */


  function traverseArray(arr, searchForObj) {
    var len = arr.length;

    for (var _i2 = 0; _i2 < len; _i2++) {
      var item = arr[_i2];

      if ((0, _utils.isArray)(item)) {
        traverseArray(item, searchForObj);
      } else if ((0, _utils.isObject)(item)) {
        traverseObject(item, searchForObj);
      }
    }
  }

  traverseObject(toSearch, searches);
  return results;
}