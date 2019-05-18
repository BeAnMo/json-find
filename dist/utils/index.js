"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAtom = isAtom;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isNull = isNull;
exports.isCompound = isCompound;
exports.isKey = isKey;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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