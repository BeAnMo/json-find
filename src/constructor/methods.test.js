import Doc from './index';
import { BASIC_ARR, TEST_DATA } from '../../test/test-data';

describe('Json-Find iterating instance methods (default conifg)', () => {
  const DOC0 = Doc(BASIC_ARR);
  const DOC1 = Doc(TEST_DATA);

  describe('fold', () => {
    it('reduces to a single value', () => {
      const sum0 = DOC0.fold((acc, val) => acc + val, 0);

      expect(sum0).toBe(33);
    });

    it('reduces to an array', () => {
      const arr1 = DOC1.fold(
        (acc, val) => (val === 'topic' ? [...acc, val] : acc),
        []
      );

      expect(arr1.length).toBe(6);
    });
  });

  describe('prune', () => {
    it('filters an object but keeps the original shape', () => {
      const obj1 = DOC1.prune((val, key) => key === 'type' && val === 'topic');

      expect(obj1.at('list.story.0.parent.4.type')).toBe('topic');
    });
  });
});
