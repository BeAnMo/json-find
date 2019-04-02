import JsonFind from './index';

test('no methods are enumerable', () => {
  const doc = JsonFind({});

  expect(Object.keys(doc).length).toBe(0);
});
