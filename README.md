<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, project_title, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <!--<a href="https://github.com/BeAnMo/json-find">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>-->

  <h3 align="center">Json-Find</h3>

  <p align="center">
    Json-Find is a data transformation library that gives JSON-compatible data chainable, Array-inspired methods.
    <br />
    <br />
    <a href="https://github.com/BeAnMo/json-find/issues">Report Bug</a>
    ·
    <a href="https://github.com/BeAnMo/json-find/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
        <a href="#Examples">Examples</a>
        <ul>
            <li><a href="#reddit-comments">Reddit Comments</a></li>
        </ul>
    </li>
    <li>
      <a href="#documentation">Documentation</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#instantiation">Instantiation</a></li>
        <li><a href="#json-document">JSON Document</a></li>
        <li><a href="#json-path">JSON Path</a></li>
        <li><a href="#breadth-first-stream">Breadth First Stream</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Currently, Json-Find only supports JSON-compatible objects.

For a refresher, a JSON-compatible object is one of:
- Booleans
- Numbers
- Strings
- Objects (of valid JSON)
- Arrays (of valid JSON)


<!-- USAGE EXAMPLES -->
## Examples

### Reddit Comments

Imagine your projectct needs to extract the text & scores from reddit comments. Comment pages are arbitrarily nested arrays of objects of arrays of objects which can require dozens of lines of looping & null checking to extract the necessary data.

JsonFind does that work with a couple of chained method calls.

```js
await fetch(`${REDDIT_COMMENTS_URL}.json`)
	.then(r => r.json())
	.then(json => {
        const rows = new JsonFind(json)
            // 1
            .prune(({ key }) => 'author score created body'.includes(key))
            // 2
            .fold((acc, { path, key, value }) => {
                const root = path
                    // 3
                    .slice(0, -1)
                    // 4
                    .join('/');
                // 5
                return acc.set(`${root}.${key}`, value);
            }, new JsonFind({}))
            // 6
            .toggle()
            // 7
            .get()
            // 8
            .map(([key, values]) => values);

        console.table(rows);
    })
	.catch(console.error);
```
1. Prunes the comment tree for the specified keys. Keep in mind that just like an Array.filter.reduce chain, the pruning for Doc.prune.fold can be done entirely within the fold operation. Separating `prune` and `fold` simply makes it easier to swap out operations when changes are required.
2. Folds the pruned tree into a flattened Object of `{ ...key: { created, score, body, author } }`.
3. Moves up one from the current path to get the necessary root path (think `$ cd ..`).
4. The delimeter is replaced to allow using the whole root path as a single Object key. This prevents the recreation of the original shape by flattening the whole tree (`nested.path.to.key` becomes `nested/path/to.key`).
5. Update and return the accumulator Object `{...<path/to/object>: {...<key>: value } }`.
6. Converts the flattened tree into an array of `[...[key, { created, score, body, author }]]`.
7. Returns the current document.
8. Can now use native Array methods for further processing.

## Documentation

### Installation

1. Install from NPM
   ```sh
   npm install json-find
   ```

---

### JSON Document

#### Instantiation

```js
JsonFindInstance = JsonFind(doc: Object | Array, options?: Object)

ValidPath = JsonPathInstance | string | string[]

StreamItem = Object<{
    path: JsonPathInstance,
    key: string,
    value: null | boolean | number | string
}>


InstanceInterface = {
    static clone(Object | Array) => Object | Array,

    get(path?: ValidPath, options?: { useConstructor: false }) => JsonFindInstance | Object | Array,

    set(path: ValidPath, value: any) => JsonFindInstance,

    fold(proc: (accumulator: any, item: StreamItem) => any, accumulator: any) => any,

    transform(proc: (item: StreamItem) => any) => JsonFindInstance,

    prune(predicate: (item: StreamItem) => boolean) => JsonFindInstance,

    each(proc: (item: StreamItem) => any) => JsonFindInstance,

    select(predicate: (item: StreamItem) => boolean) => any,

    smoosh() => JsonFindInstance,

    toggle() => JsonFindInstance,

    toStream() => BFSteamInstance
}
```

Options:
| Key | ValueType | Default | Description |
|-----|-----------|---------|-------------|
| delimeter | `string` | `"."` | The delimeter for paths (e.g. 'rootKey.0.aChildKey' or 'rootKey/0/aChildKey'). |
| useConstructor | `boolean` | `false` | Return a JsonFind instance when retrieving a specifc key instead of the raw value (only for Objects/Arrays). |

```js
    /* CommonJS */
    const JsonFind = require('json-find/dist/json-find.node');
    /* ES6, production version */
    import JsonFind from 'json-find/dist/json-find.node.min';
    /* Available as JsonFind when using a script tag */

    const test = {
        "a": 1,
        "b": 2,
        "c": 3
    }

    // "new" is optional.
    const doc = new JsonFind(test);
    const doc = JsonFind(test);
    // Use a custom delimeter.
    const doc = JsonFind(test, { delimeter: '***' });
```

If passed invalid JSON, JsonData will throw an error. If passed a Number/String/Boolean/null, JsonData will simply return the given argument.

A document instance wraps the given object. For testing/debugging, consider deep-cloning an object before passing it to the constructor to prevent unwanted mutations.

- **clone**
    - Performs a deep clone of the given object.
- **get**
    - If `useConstructor` is `true` and the value at the given path is an Object or Array, a new JsonFind instance wrapping the retrieved value is returned. Otherwise, just the raw value is returned. When no `path` is provided or if `path` is and empty string (`""`), the current object is returned.

- **set**
    - Mutates the JsonFind instance at the given path with a value and returns the instance.

### Iterating

Part of the goal of Json-Find is to give users an interface comparable to native Array methods, providing a concise, chainable API. Rather than copy Array method names, Json-Find uses alternates to ensure a user can bounce between Json-Find and Array methods without confusion.

| Array | JsonFind |
|-----|-----------|
| reduce | fold | 
| map | transform |
| filter | prune |
| forEach | each |
| find | select |

The callbacks for all iterative instance methods bind the current instance to `this`.

- **fold**
    - Object keys are assumed to be unordered, which means there is no `Array.reduceRight` equivalent.
- **transform**
    - Maps a procedure to each value in a doc.
- **prune**
    - "Prunes" a tree returning all values that match the predicate function but maintains the shape of the original document. This may return sparse arrays.
- **each**
    - Applies the given procedure to each value but does not return a result, but instead returns the instance to allow for chaining.
- **select**
    - Returns the first value that matches the predicate or `undefined`.
- **smoosh**
    - Completely flattens an object to a single of Object of `{...string<JFPath>: any }`.
- **toggle**
    - Toggles the root object between Object and Array. Toggling Object->Array creates `[...[string<key>, any]]` and Array->Object creates `{...number: any}`.
- **toStream**
    - Exposes the breadth-first stream.

---

### JSON Path

A Path is a convenience wrapper to abstract the swapping of path strings and arrays and path navigation.

```js
JsonPathInstance = new JsonPath(string | string[], delimeter: string)

InstanceInterface = {
    toString() => string

    toArray() => Array,

    join(delimiter?: string) => string,

    clone() => JsonPathInstance,

    slice(from?: number, to?: number) => JsonPathInstance,

    append(key: string | number) => JsonPathInstance
}
```

- **toString**
    - Returns the current path array as a string separated by the current delimiter.
- **toArray**
    - Return the current path array.
- **join**
    - With no argument provided, `path.join` calls `path.toString`. if a string argument is provided, it will join the current path array by the given string.
- **clone**
    - Creates a clone using the current path array and delimiter.
- **slice**
    - Mimics `Array.slice` & `String.slice`. Returns a new path instance based on the selection of `from` and `to`.
- **append**
    - Mutates the current instance by appending a key at the end of the current path. Returns the instance.

---

### Breadth First Stream
JsonFind uses a breadth-first stream of primitives under the hood. The algorithm will always emit primitive values instead of their encompassing Objects/Arrays. Array indexes are cast as strings.

```js
BFStreamInstance = new BFStream(Object | Array, delimeter: string)

InstanceInterface = {
    private setQueue(path: JsonPath, key: string[]) => BFStreamInstance,

    empty() => boolean,

    next() => StreamItem
}
```

- **setQueue**
    - Loads the internal queue by unique paths for each key.
- **empty**
    - Returns `true` if the queue is empty.
- **next**
    - Advances to the next key:value pair within an object.

<br />

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Project Link: [https://github.com/BeAnMo/json-find](https://github.com/BeAnMo/json-find)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/BeAnMo/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/BeAnMo/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/BeAnMo/repo.svg?style=for-the-badge
[forks-url]: https://github.com/BeAnMo/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/BeAnMo/repo.svg?style=for-the-badge
[stars-url]: https://github.com/BeAnMo/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/BeAnMo/repo.svg?style=for-the-badge
[issues-url]: https://github.com/BeAnMo/repo/issues
[license-shield]: https://img.shields.io/github/license/BeAnMo/repo.svg?style=for-the-badge
[license-url]: https://github.com/BeAnMo/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/github_username
