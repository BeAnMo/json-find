import JsonPath from './json-path';

describe('JsonPath', () => {
    it('should contain a path array regardless of the input value', () => {
        expect(new JsonPath('hello', '.').path).toStrictEqual(['hello']);
        expect(new JsonPath(['hello'], '.').path).toStrictEqual(['hello']);
    });

    it('should resolve to the correct string & array values', () => {
        const t0 = new JsonPath('hello.this.0.is.1.a.test', '.');

        expect(t0.toString()).toBe('hello.this.0.is.1.a.test');
        expect(t0.toArray()).toStrictEqual('hello.this.0.is.1.a.test'.split('.'));
    });

    it('should add a key to the end when appending', () => {
        const t0 = new JsonPath('hello.this.is.a', '.');

        expect(t0.append('test').toString()).toBe('hello.this.is.a.test');
    });

    it('should slice properly', () => {
        const t0 = new JsonPath('hello.this.is.a', '.');

        expect(t0.slice(1).toString()).toBe('this.is.a')
        expect(t0.slice(1, 3).toString()).toBe('this.is');
        expect(t0.slice(0, -1).toString()).toBe('hello.this.is');
        expect(t0.slice(-1).toString()).toBe('a');
    });
});