import Queue from './queue';

describe('A Queue instance', () => {
    const q0 = new Queue();

    it('should return undefined when popping from an empty queue', () => {
        expect(q0.pop()).toBe(undefined);
    });
});