import { getDoc, setDoc } from './index';
import { TEST_DATA, BASIC, BASIC_ARR } from '../../test/test-data';

describe('Getting a document', () => {
  it('should retrieve a value at the root level', () => {
    // for object
    expect(getDoc(TEST_DATA, ['version'])).toBe('0.6');
    expect(getDoc(BASIC, ['c'])).toBe(null);
    // for array
    expect(getDoc(BASIC_ARR, ['1'])).toBe(4);
  });

  it('should retrieve a value from an arbitary nesting', () => {
    // for object
    expect(getDoc(TEST_DATA, ['list', 'miniTeaser', '$text'])).toBe(
      'Custom NPR News Feed API.  Visit http://api.npr.org/help.html for more information.'
    );
    // for array
    expect(
      getDoc(TEST_DATA, ['list', 'story', '0', 'show', '0', 'program', 'code'])
    ).toBe('WESAT');
  });
});

describe('Setting a document', () => {
  it('should set a value at the root level', () => {
    // for object
    expect(setDoc(BASIC, ['c'], 3)).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it('should set a value from an arbitary nesting', () => {
    expect(setDoc(BASIC_ARR, ['3', '1', 'a'], 'hello')).toEqual([
      3,
      4,
      [5, 6],
      [{ a: 7 }, { a: 'hello' }]
    ]);
  });

  it('should mutate the original object', () => {
    let T = { a: 1, b: 2, c: { d: { e: false } } };

    let _T = setDoc(T, ['c', 'd', 'e'], true);

    expect(_T).toEqual(T);
  });
});
