import flatFold from './index';
import { TEST_DATA } from '../../test/npr';

test('mimick Array.reduce', () => {
  const arr = [{ a: 1, b: 2 }, { a: 2, b: 4 }, { a: 3, b: 6 }];

  expect(flatFold(0, arr, (acc, { a }) => acc + a)).toBe(6);
  expect(flatFold(1, arr, (acc, { b }) => acc * b)).toBe(48);

  expect(flatFold([], TEST_DATA, (acc, item, key) => [...acc, key])).toEqual([
    'version',
    'list'
  ]);
});
