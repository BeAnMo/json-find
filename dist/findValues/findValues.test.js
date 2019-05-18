"use strict";

var _index = _interopRequireDefault(require("./index"));

var _testData = require("../../test/test-data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import { Json } from '../types';
test('null check', function () {
  expect((0, _index["default"])(_testData.BASIC, 'a')).toEqual({
    a: 1
  });
  expect((0, _index["default"])(_testData.BASIC, 'c')).toEqual({
    c: null
  });
});
test('at root of object', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'version')).toEqual({
    version: '0.6'
  });
});
test('retrieves first values only', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'title', 'teaser')).toEqual({
    title: {
      $text: 'Stories from NPR'
    },
    teaser: {
      $text: 'Assorted stories from NPR'
    }
  });
});
test('"$test was already retrieved by "title", so first "$test" encountered is nested in "teaser"', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'title', '$text')).toEqual({
    title: {
      $text: 'Stories from NPR'
    },
    $text: 'Assorted stories from NPR'
  });
});
test('return empty object', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'titles', 'teasers')).toEqual({});
});
test('a given key does not exist in the object', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'what', 'link', 'subtitle')).toEqual({
    link: [{
      type: 'html',
      $text: 'http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3'
    }, {
      type: 'api',
      $text: 'http://api.npr.org/query?id=91280049'
    }],
    subtitle: {}
  });
});
test('inside of repeated keys', function () {
  expect((0, _index["default"])(_testData.TEST_DATA, 'titles', 'type_TEST')).toEqual({
    type_TEST: 'api'
  });
});