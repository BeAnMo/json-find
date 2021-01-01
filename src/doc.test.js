import Doc from './doc';

describe('A json-document instance getters/setters', () => {
    const d0 = new Doc({ a: 1, b: 2, c: [3, 4, 5] });

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

    it('should set a path to the given value', () => {
        const d0a = d0.setAt('a', 7);

        expect(d0a.doc).toStrictEqual({ a: 7, b: 2, c: [3, 4, 5] });

        const d0b = d0.setAt('c.2', 7);

        expect(d0b.doc).toStrictEqual({ a: 7, b: 2, c: [3, 4, 7] });

        // Replace a primitive with a compound object.
        const d0c = d0.setAt('b', [5, 6]);
     
        expect(d0c.doc).toStrictEqual({ a: 7, b: [5, 6], c: [3, 4, 7] });
    });
});