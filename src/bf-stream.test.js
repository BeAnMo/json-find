import BFStream from './bf-stream';
import Doc from './doc';

describe('A breadth-first stream instance', () => {
    const d0 = { a: 1, b: 2, c: [3, 4, 5] };
    const s0 = new BFStream(d0, '.');
    const values = [
        {
            key: 'a',
            value: 1,
            path: 'a'
        },
        {
            key: 'b',
            value: 2,
            path: 'b'
        },
        {
            key: '0',
            value: 3,
            path: 'c.0'
        },
        {
            key: '1',
            value: 4,
            path: 'c.1'
        },
        {
            key: '2',
            value: 5,
            path: 'c.2'
        }
    ];

    it('should iterate over the expected values', () => {
        let i = 0;

        while (!s0.empty()) {
            const actual = s0.next();
            const expected = values[i];

            expect(actual).toStrictEqual(expected);
            i++;
        }
    });
});