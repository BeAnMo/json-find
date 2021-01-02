[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/BeAnMo/json-find)

# JSON-FIND-2 (JSON-FOUND)

Json-Find is a data transformation library with the goal of giving JSON-compatible* data an interface comparable to JavaScript's native Array.

*For a refresher, a JSON-compatible object is one of:
- Booleans
- Numbers
- Strings
- Objects (of valid JSON)
- Arrays (of valid JSON)

---


### API

#### Instantiation

`JsonFind(doc: any, options?: { delimiter: '.', useConstructor: false }) => JFInstance`

```js
    /* CommonJS */
    const JsonFind = require('json-find');
    /* ES6 */
    import JsonFind from 'json-find';
    /* Available as JsonFind when using a script tag */

    const test = {
        "a": 1,
        "b": 2,
        "c": [
            3, 
            4, 
            {
                "d": {
                    "e": 5
                },
                "f": {
                    "e": 8
                }
            }
        ],
        "d": 7
    }

    const doc = JsonFind(test);
```

If passed invalid JSON, JsonData will throw an error. If passed a Number/String/Boolean/null, JsonData will simply return the given argument.

---

#### Getting/Setting

##### `doc.getAt(pathStr: string, options?: { useConstructor: false })`

If `useConstructor` is `true` and the value at the given path is an Object or Array, a new JsonFind instance wrapping the retrieved value is returned. Otherwise, just the raw value is returned.

##### `doc.setAt(pathStr: string, value: any)`

Mutates the JsonFind instance at the given path with a value and returns the instance.

#### Iterating

JsonFind uses a breadth-first stream of primitives under the hood. The algorithm will always emit primitive values instead of their encompassing Objects/Arrays. Array indexes are cast as strings.

A StreamItem is `{ value: string | number | boolean | null, key: string, path: string }`.

##### `doc.fold(proc: (accumulator: any, item: StreamItem) => any, accumulator: any) => any`

Similar to `Array.reduce`. Object keys are assumed to be unordered, which means there is no `Array.reduceRight` equivalent.

##### `doc.transform(proc: (item: StreamItem) => any) => JFInstance`

Similar to `Array.map`, maps a procedure to each value in a doc.

##### `doc.prune(predicate: (item: StreamItem) => boolean) => JFInstance`

Similar to `Array.filter`, "prunes" a tree returning all values that match the predicate function.

##### `doc.each(proc: (item: StreamItem) => any) => JFInstance`

Similar to `Array.forEach`, applies the given procedure to each value but does not return a result, but instead returns the instance to allow for chaining.

##### `doc.find(predicate: (item: StreamItem) => boolean) => any`

Similar to `Array.find`, returns the first value that matches the predicate or `undefined`.

##### `doc.findAll(predicate: (item: StreamItem) => boolean) => StreamItem[]`

Returns an array of stream items that match the given predicate.
