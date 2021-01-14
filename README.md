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
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/BeAnMo/json-find">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">project_title</h3>

  <p align="center">
    Json-Find is a data transformation library with the goal of giving JSON-compatible data an interface comparable to JavaScript's native Array.
    <br />
    <a href="https://github.com/BeAnMo/json-find"><strong>Explore the docs »</strong></a>
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
        <a href="#usage">Usage & API</a>
        <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#instantiation">Instantiation</a></li>
        <li><a href="#static-methods">Static Methods</a></li>
        <li><a href="#getting-and-setting">Getting and Setting</a></li>
        <li>
            <a href="#iterating">Iterating</a>
            <ul>
                <li><a href="#fold">doc.fold</a></li>
                <li><a href="#transform">doc.transform</a></li>
                <li><a href="#prune">doc.prune</a></li>
                <li><a href="#each">doc.each</a></li>
                <li><a href="#find">doc.find</a></li>
                <li><a href="#find-all">doc.findAll</a></li>
            </ul>
        </li>
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
## Usage

### Installation

1. Install from NPM
   ```sh
   npm install json-find
   ```

### Instantiation

```js
JsonFind(doc: any, options?: Object) => JFInstance
```

Options:
| Key | ValueType | Default | Description |
|-----|-----------|---------|-------------|
| delimeter | `string` | `"."` | The delimeter for paths (e.g. 'rootKey.0.aChildKey' or 'rootKey/0/aChildKey'). |
| useConstructor | `boolean` | `false` | Return a JsonFind instance when retrieving a specifc key instead of the raw value (only for Objects/Arrays). |

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
    // Use a custom delimeter.
    const doc JsonFind(test, { delimeter: '***' });
```

If passed invalid JSON, JsonData will throw an error. If passed a Number/String/Boolean/null, JsonData will simply return the given argument.

### Static Methods

```js
JsonFind.clone(Object | Array) => Object | Array
```

Performs a deep clone of the given object.

### Getting and Setting

- `doc.get(pathStr: string, options?: { useConstructor: false })`

If `useConstructor` is `true` and the value at the given path is an Object or Array, a new JsonFind instance wrapping the retrieved value is returned. Otherwise, just the raw value is returned.

- `doc.set(pathStr: string, value: any)`

Mutates the JsonFind instance at the given path with a value and returns the instance.

### Iterating

JsonFind uses a breadth-first stream of primitives under the hood. The algorithm will always emit primitive values instead of their encompassing Objects/Arrays. Array indexes are cast as strings.

The callbacks for all iterative instance methods bind the current instance to `this`.

A StreamItem is `{ value: string | number | boolean | null, key: string, path: string }`.

#### Fold

```js
doc.fold(proc: (accumulator: any, item: StreamItem) => any, accumulator: any) => any
```

Similar to `Array.reduce`. Object keys are assumed to be unordered, which means there is no `Array.reduceRight` equivalent.

#### Transform

```js
doc.transform(proc: (item: StreamItem) => any) => JFInstance
```

Similar to `Array.map`, maps a procedure to each value in a doc.

#### Prune

```js
doc.prune(predicate: (item: StreamItem) => boolean) => JFInstance
```

Similar to `Array.filter`, "prunes" a tree returning all values that match the predicate function.

#### Each

```js
doc.each(proc: (item: StreamItem) => any) => JFInstance
```

Similar to `Array.forEach`, applies the given procedure to each value but does not return a result, but instead returns the instance to allow for chaining.

#### Find

```js
doc.find(predicate: (item: StreamItem) => boolean) => any
```

Similar to `Array.find`, returns the first value that matches the predicate or `undefined`.

#### Find All

```js
doc.findAll(predicate: (item: StreamItem) => boolean) => StreamItem[]
```

Returns an array of stream items that match the given predicate.

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



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
