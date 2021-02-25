import Doc from './doc';

describe('Json-document instantiation', () => {
    it('should throw when passed a primitive value', () => {
        expect(() => Doc(43)).toThrow();
        expect(() => Doc('hey there')).toThrow();
        expect(() => Doc(null)).toThrow();
        expect(() => Doc(true)).toThrow();
    });

    it('should instantiate with & without "new"', () => {
        const d0 = Doc({ a: 1, b: 2 });

        expect(d0).toBeInstanceOf(Doc);

        const d1 = new Doc({ a: 1, b: 2 });

        expect(d1).toBeInstanceOf(Doc);
    });
});

describe('Json-document static methods', () => {
    it('should perform a deep clone of an Object', () => {
        const base = { a: 1, b: 2, c: [3, 4, 5] };

        expect(Doc.clone(base)).toStrictEqual({ a: 1, b: 2, c: [3, 4, 5] });
    });

    it('should perform a deep clone of an Array', () => {
        const base = [1, 2, { c: [3, 4, 5] }];

        expect(Doc.clone(base)).toStrictEqual([1, 2, { c: [3, 4, 5] }]);
    });

    it('should return a schema based on primitive values', () => {
        const doc = {
            a: 1,
            b: 'hello',
            c: [{ value: 4 }, { value: '5' }, { value: 6 }]
        };
        const fullSchema = {
            a: 'number',
            b: 'string',
            c: [{ value: 'number' }, { value: 'string' }, { value: 'number' }]
        };
        // TODO
        const firstOnlySchema = {
            a: 'number',
            b: 'string',
            c: [{ value: 'number' }]
        };

        expect(Doc.schema(doc)).toStrictEqual(fullSchema);
        //expect(Doc.schema(doc, { firstArrayElementOnly: true })).toStrictEqual(firstOnlySchema);
    });
});

describe('A json-document instance getters/setters', () => {
    const base = { a: 1, b: 2, c: [3, 4, 5] };
    const clone = () => Doc.clone(base);
    const d0 = new Doc(clone());

    it('should retrieve a value at the given key', () => {
        const d0b = d0.get('c.2', { useConstructor: false });

        expect(d0b).toBe(5);

        const d0c = d0.get('c', { useConstructor: false });

        expect(d0c).toStrictEqual([3, 4, 5]);

        const d0d = d0.get('b', { useConstructor: false });

        expect(d0d).toStrictEqual(2);
    });

    it('should retrieve an instance at the given key unless the result is a primitive', () => {
        const d0b = d0.get('c.2', { useConstructor: true });

        expect(d0b).toBe(5);

        const d0c = d0.get('c', { useConstructor: true });

        expect(d0c).toStrictEqual(new Doc([3, 4, 5]));
    });

    it('should set a root key to the given value', () => {
        const d1 = new Doc(clone());
        const d1a = d1.set('a', 7);

        expect(d1a.doc).toStrictEqual({ a: 7, b: 2, c: [3, 4, 5] });

        // Replace a primitive with a compound object.
        const d3 = new Doc(clone());
        const d3a = d3.set('b', [5, 6]);

        expect(d3a.doc).toStrictEqual({ a: 1, b: [5, 6], c: [3, 4, 5] });
    });

    it('should set a nested key to the given value', () => {
        const d2 = new Doc(clone());
        const d2a = d2.set('c.2', 7);
        expect(d2a.doc).toStrictEqual({ a: 1, b: 2, c: [3, 4, 7] });
    });

    it('should not have mutated the original test object', () => {
        expect(base).toStrictEqual({ a: 1, b: 2, c: [3, 4, 5] });
    });
});

describe('Json-document instance iterative methods', () => {
    const base = { a: 1, b: 2, c: [3, 4, 5] };

    it('should "prune" a nested Object by its values', () => {
        const clone = new Doc(Doc.clone(base));

        const pruned = clone.prune(({ value }) => value % 2 === 0);

        // An "empty slot" is not equal to "undefined".
        let arr = [];
        arr[1] = 4;

        expect(pruned.doc).toStrictEqual({ b: 2, c: arr });
    });

    it('should "prune" a nested Object by its keys', () => {
        const clone = new Doc(Doc.clone(base));

        const pruned = clone.prune(({ key }) => key === 'a' || key === '0' || key === '2');
        // An "empty slot" is not equal to "undefined".
        let arr = [3];
        arr[2] = 5;

        expect(pruned.doc).toStrictEqual({ a: 1, c: arr });
    });
});