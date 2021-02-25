import JsonFind from '../src';
import DATA from './reddit-comments.json';

describe('Real life reddit comment data', () => {
    const doc = JsonFind(DATA);
    const prunedCreated = doc
        .prune(({ key }) => key === 'created')
        .smoosh()
        .toggle()
        .get();


    it('should find 201 instances of the "created" key', () => {
        expect(prunedCreated.length).toBe(201);
    });

    it('each encountered "created" value should be a UNIX timestamp', () => {
        const isTimestamp = n => {
            return new Date(n * 1000).getTime() > new Date('2010-01-01');
        };

        for (const [k, v] of prunedCreated) {
            expect(isTimestamp(v)).toBeTruthy();
        }
    });
});