# JSON-FIND

The goal of the module is provide easy access to JSON or JSON-compatible* values. This is not intended for complex JSON queries, but rather for retrieving specifc values without the need to constantly reference a file's structure. In other words, if you are treating JSON as a database and making multiple queries on the same file, this is not for you. However, if you need to get information from JSON data such as from reasonably consistent web API calls where the structure of the data can undergo subtle structural changes, then this module aims to provide a convenient way to access that data.

*a JSON-compatible object means the contents of the object can only be:
- Booleans
- Numbers
- Strings
- Objects (of valid JSON)
- Arrays (of valid JSON)

---

### API

#### Instantiation

```js
    /* CommonJS */
    const JsonFind = require('json-find');
    /* ES6 */
    import JsonFind from 'json-find';

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

#### #.checkKey(Object, String) -> JSON or False

Performs a depth-first search for the given key and returns its value, otherwise false.

```js
    doc.checkKey('g'); // false
    doc.checkKey('e'); // 5
    doc.checkKey('f'); // { e: 8 } 
```

---

#### #.findValues(Object, ...String) -> Object
    
Searches the given Object for each key given. If a given key exists in the Object, its key/value pair
are copied to the resulting Object. If none are matched, an empty Object is returned.

If given an Object with multiple identical keys, the value of the first matching key found will be returned, ignoring the others. However, if identical keys exist on the same level within an Object, the value of the last key will be returned.

```js
    doc.findValues('z');      // {}
    doc.findValues('z', 'd'); // { "d": { "e": 5 } }
    doc.findValues('a', 'd'); // { "a": 1, "d": { "e": 5 } }
    
    // a.c[2].d.e has already been retrieved,
    // so the value of the first matching key encountered 
    // by the search for "e" is 8
    doc.findValues('d', 'e'); // { "d": { "e": 5 }, "e": 8 }
```

---

#### #.extractPaths([...String] or False, ...[...String]) -> Object

Extracts the values from JSON at given paths and returns a new Object with values at the given keys. A ```Path``` is an Array-of-String|Number, consisting of all keys (including Array indexes) from a root key to the key for the desired value. 

The first parameter is an Array of new keys names. If no new names are necessary, ```false``` maybe be passed instead. 

After the new keys parameter, an arbitrary number of ```Paths``` maybe passed. If no new keys are passed, the keys for the returned Object will be the last item in each Path. If there are more Paths than keys, the original keys are used assigned to values without a new key. If there are more new keys than Paths, null is assigned to the extra new keys. If the same key is reused, the key is renamed key + index.

```js
    const test = {
        c: 1,
        b: [
            { c: 2, d: 4, e: 'two' },
            { c: 3, d: 6 },
            { c: 4, d: 8, e: 'four' },
            { c: 5, d: 10 }
        ],
        f: 'six',
        g: {
            h: 'eight',
            i: [
                { j: 'ten' }
            ]
        }
    };

    const doc = JsonFind(test);

    doc.extractPaths(false, ['b', 3, 'c']); // { c: 5 }
    doc.extractPaths(
        ['f is', 'h is', 'j is'], // new keys to be assigned 
        ['f'],                    // paths given
        ['g', 'h'], 
        ['g', 'i', 0, 'j']
    );
    // { 'f is': 'six', 'h is': 'eight', 'j is': 'ten' } 

    /* more Paths than keys */
    doc.extractPaths(
        ['a', 'b'], 
        ['b', 0, 'c'], 
        ['b', 1, 'c'], 
        ['b', 2, 'c']
    );
    // { a: 2, b: 3, c: 4 }

    /* same key reused */
    doc.extractPaths(
        false, 
        ['b', 0, 'c'], 
        ['b', 1, 'c'], 
        ['b', 2, 'c']
    ); 
    // { c: 2, "c+1": 3, "c+2": 4 }

    /* more keys than Paths */
    doc.extractPaths(
        ['a', 'b', 'c'], 
        ['f'], 
        ['g', 'i']
    );
    // { a: 'six', b: { h: 'eight', i: [{ j: 'ten' }] }, c: null }

    /* accessing all items in an Array */
    doc.b.map((obj, index) => doc.extractPaths(['c is'], ['b', index, 'c']));
    // [{ 'c is': 2 }, { 'c is': 3 }, { 'c is': 4 }, { 'c is': 5 }]
```
