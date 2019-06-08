"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Queue = Queue;
exports.isAtom = isAtom;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isNull = isNull;
exports.isCompound = isCompound;
exports.isKey = isKey;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

function isAtom(v) {
  return null === v || typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string';
}

function isArray(v) {
  return Array.isArray(v);
}

function isObject(v) {
  return _typeof(v) === 'object' && !isArray(v) && v !== null;
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