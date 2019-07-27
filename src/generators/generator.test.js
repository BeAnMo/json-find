import primitive_bfs_gen from './index';
import { BASIC_ARR } from '../../test/test-data';
import { isAtom } from '../utils';

describe('ES6 primitive generator', () => {
  const G = () => primitive_bfs_gen(BASIC_ARR, '.');

  describe('should', () => {
    let count = 0;

    for (const { value, key, path } of G()) {
      count++;

      it('only yield primitive values', () => {
        expect(isAtom(value)).toBeTruthy();
      });

      it('have string values for key & path', () => {
        expect(typeof key).toBe('string');
        expect(typeof path).toBe('string');
      });
    }

    it('count the correct number of primitives', () => {
      expect(count).toBe(6);

      expect([...G()].length).toBe(6);
    });
  });
});
