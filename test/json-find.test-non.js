const JSF = require('../json-find');
const DATA_0 = require('./npr.json');

const JF_0 = JSF(DATA_0);
const JF_1 = JSF({ a: 1, b: 2, c: null, d: 4 });

test('checkKey: null check', () => {
  expect(JF_1.checkKey('a')).toBe(1);
  expect(JF_1.checkKey('c')).toBeNull();
});

test('findValues: null check', () => {
  expect(JF_1.findValues('a')).toEqual({ a: 1 });
  expect(JF_1.findValues('c')).toEqual({ c: null });
});

test('checkKey: First item encountered in an object', () => {
  // First item encountered in an object
  expect(JF_0.checkKey('version')).toBe('0.6');
  expect(JF_0.checkKey('orgAbbr')).toBe('NPR');
  // first of several idential keys
  expect(JF_0.checkKey('id')).toBe('91280049');
});

test('checkKey: Deeply nested, empty object', () => {
  expect(JF_0.checkKey('rightsHolder')).toEqual({});
});

test('checkKey: first of several idential keys - array', () => {
  expect(JF_0.checkKey('link')).toEqual([
    {
      type: 'html',
      $text:
        'http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3'
    },
    { type: 'api', $text: 'http://api.npr.org/query?id=91280049' }
  ]);
});

test('checkKey: object', () => {
  expect(JF_0.checkKey('slug')).toEqual({ $text: 'Interviews' });
});

test('checkKey: deeply nested, single object contains multiple identical keys, returns value of the last key', () => {
  expect(JF_0.checkKey('refId')).toBe('91281093');
});

test('findValues: at root of object', () => {
  expect(JF_0.findValues('version')).toEqual({ version: '0.6' });
});

test('findValues: retrieves first values only', () => {
  expect(JF_0.findValues('title', 'teaser')).toEqual({
    title: { $text: 'Stories from NPR' },
    teaser: { $text: 'Assorted stories from NPR' }
  });
});

test('findValues: "$test was already retrieved by "title", so first "$test" encountered is nested in "teaser"', () => {
  expect(JF_0.findValues('title', '$text')).toEqual({
    title: { $text: 'Stories from NPR' },
    $text: 'Assorted stories from NPR'
  });
});

test('findValues: return empty object', () => {
  expect(JF_0.findValues('titles', 'teasers')).toEqual({});
});

test('findValues: a given key does not exist in the object', () => {
  expect(JF_0.findValues('what', 'link', 'subtitle')).toEqual({
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

test('findValues: inside of repeated keys', () => {
  expect(JF_0.findValues('titles', 'type_TEST')).toEqual({ type_TEST: 'api' });
});

test('extractPaths: basic, no renaming', () => {
  expect(JF_0.extractPaths(false, ['version'])).toEqual({ version: '0.6' });
});

test('extractPaths: basic rename', () => {
  expect(JF_0.extractPaths('v', ['version'])).toEqual({ v: '0.6' });
});

test('extractPaths: extra keys given for renaming, extras are assigned "null"', () => {
  expect(JF_0.extractPaths(['v', 'c'], ['version'])).toEqual({
    v: '0.6',
    c: null
  });
});

test('extractPaths: rename first path, nested value at second', () => {
  expect(JF_0.extractPaths(['v'], ['version'], ['list', 'title'])).toEqual({
    v: '0.6',
    title: { $text: 'Stories from NPR' }
  });
});

test('extractPaths: rename along path with array index', () => {
  expect(JF_0.extractPaths(['storyId'], ['list', 'story', 0, 'id'])).toEqual({
    storyId: '91280049'
  });
});

test('extractPaths: auto-rename along deeply-nested paths with array indexes', () => {
  expect(
    JF_0.extractPaths(
      false,
      ['list', 'story', 0, 'parent', 0, 'link', 0, 'type'],
      ['list', 'story', 0, 'parent', 0, 'link', 1, 'type']
    )
  ).toEqual({ type: 'html', 'type+1': 'api' });
});

test('extractPaths: rename along deeply nested paths', () => {
  expect(
    JF_0.extractPaths(
      ['sluggo', 'teasering'],
      ['list', 'story', 0, 'slug'],
      ['list', 'story', 0, 'teaser']
    )
  ).toEqual({
    sluggo: { $text: 'Interviews' },
    teasering: {
      $text:
        'Scott Simon talks with boxing promoter Don King and boxing hall of famer Larry Holmes about their new video game, <em>Don King Presents: Prizefighter</em>, with story lines, in and out of the ring.'
    }
  });
});
