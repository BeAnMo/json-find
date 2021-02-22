const { performance } = require('perf_hooks');
const data = require('./reddit-comments.json');

const JsonFind = require('../dist/json-find.node');

const runtime = (proc, name = 'PROCESS') => {
    let count = 0;
    let total = 0;
    let max = 0;
    let min = Infinity;

    return (...args) => {
        const start = performance.now();
        const results = proc(...args);
        const end = performance.now();
        const diff = end - start;

        count += 1;
        total += diff;

        if (diff > max) {
            max = diff;
        }

        if (diff < min) {
            min = diff;
        }

        console.log({
            runtime: name,
            current_ms: Math.round(diff),
            avg_ms: Math.round(total / count),
            min_ms: Math.round(min),
            max_ms: Math.round(max),
        });

        return results;
    };
};

const redditCommentExample = () => {
    return new JsonFind(data)
        .prune(({ key }) => 'author score created body'.includes(key))
        .fold((acc, { path, key, value }) => {
            const root = path
                .join('/');
            return acc.set(`${root}.${key}`, value);
        }, new JsonFind({}))
        .toggle()
        .get();
};

const main = (() => {
    /**
     * 2021-02-22: Initial testing (ms), 10 calls, 554kb file
     * min      avg     max
     * 19       26      50
     * 19       30      52
     * 19       28      49
     * 19       26      49
     * 20       29      52
     * 22       33      54
     */
    const test = runtime(redditCommentExample, 'example');

    for(let i = 0; i < 10; i++){
        test();
    }
})();