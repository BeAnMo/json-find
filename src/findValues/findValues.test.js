//import { Json } from '../types';
import findValues from './index';
import { BASIC, TEST_DATA } from '../../test/test-data';

test('null check', () => {
  expect(findValues(BASIC, 'a')).toEqual({ a: 1 });
  expect(findValues(BASIC, 'c')).toEqual({ c: null });
});

test('at root of object', () => {
  expect(findValues(TEST_DATA, 'version')).toEqual({ version: '0.6' });
});

test('retrieves first values only', () => {
  expect(findValues(TEST_DATA, 'title', 'teaser')).toEqual({
    title: { $text: 'Stories from NPR' },
    teaser: { $text: 'Assorted stories from NPR' }
  });
});

test('"$test was already retrieved by "title", so first "$test" encountered is nested in "teaser"', () => {
  expect(findValues(TEST_DATA, 'title', '$text')).toEqual({
    title: { $text: 'Stories from NPR' },
    $text: 'Assorted stories from NPR'
  });
});

test('return empty object', () => {
  expect(findValues(TEST_DATA, 'titles', 'teasers')).toEqual({});
});

test('a given key does not exist in the object', () => {
  expect(findValues(TEST_DATA, 'what', 'link', 'subtitle')).toEqual({
    link: [
      {
        type: 'html',
        $text:
          'http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3'
      },
      { type: 'api', $text: 'http://api.npr.org/query?id=91280049' }
    ],
    subtitle: {}
  });
});

test('inside of repeated keys', () => {
  expect(findValues(TEST_DATA, 'titles', 'type_TEST')).toEqual({
    type_TEST: 'api'
  });
});
