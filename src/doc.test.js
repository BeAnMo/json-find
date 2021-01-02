import Doc from './doc';

describe('A json-document instance getters/setters', () => {
    const base = { a: 1, b: 2, c: [3, 4, 5] };
    const d0 = new Doc({ ...base });

    it('should retrieve a value at the given key', () => {
        const d0b = d0.getAt('c.2', { useConstructor: false });

        expect(d0b).toBe(5);

        const d0c = d0.getAt('c', { useConstructor: false });

        expect(d0c).toStrictEqual([3, 4, 5]);

        const d0d = d0.getAt('b', { useConstructor: false });

        expect(d0d).toStrictEqual(2);
    });

    it('should retrieve an instance at the given key unless the result is a primitive', () => {
        const d0b = d0.getAt('c.2', { useConstructor: true });

        expect(d0b).toBe(5);

        const d0c = d0.getAt('c', { useConstructor: true });

        expect(d0c).toStrictEqual(new Doc([3, 4, 5]));
    });

    it('should set a root key to the given value', () => {
        const d1 = new Doc({ ...base });
        const d1a = d1.setAt('a', 7);

        expect(d1a.doc).toStrictEqual({ a: 7, b: 2, c: [3, 4, 5] });

        // Replace a primitive with a compound object.
        const d3 = new Doc({ ...base });
        const d3a = d3.setAt('b', [5, 6]);

        expect(d3a.doc).toStrictEqual({ a: 1, b: [5, 6], c: [3, 4, 5] });
    });

    it('should set a nested key to the given value', () => {
        const d2 = new Doc({ ...base });
        const d2a = d2.setAt('c.2', 7);
        expect(d2a.doc).toStrictEqual({ a: 1, b: 2, c: [3, 4, 7] });
    });

    it('should not have mutated the original test object', () => {
        expect(base).toStrictEqual({ a: 1, b: 2, c: [3, 4, 5] });
    });
});