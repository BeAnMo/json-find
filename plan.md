# Game plan

### Interface

current instantiation:

- pass doc to JsonFind

planned instantiation:

- pass doc to JsonFind
- pass config to JsonFind
  - delimiter: String (default ".") - custom delim
  - onlyJson: Boolean (default True) - can only be used on valid JSON
    otherwise can work with circular structures (like the DOM)
  - onlyPrimitive: Boolean (default True) - will only expose primitive values
    in iterative methods

legacy methods:

- findValues: keep functionality but rename? (replaced with searchAll)
- checkKey: remove (replaced w/ search, searchAll)
- extractPaths: replace functionality w/ some ability to rename fields & retrieve at
  a given path

planned methods:

- at: retrieves a new Doc at the given path, chainable
  - allows for "\*" to denote all keys within an object
- config: sets configuration
- set: sets the value of a given key
- get: gets the value

- fold: ~= Array.reduce, chainable
- transform: ~= Array.map, chainable
- prune: ~= Array.filter, chainable
- each: ~= Array.forEach, chainable
- andAll: ~= Array.every
- orAll: ~= Array.some
- search: ~= Array.find, chainable
  - can pass predicate or a single key
- searchAll: ~= Array.find, chainable (returns all items as array instead of single item), chainable

  - can pass predicate or multiple keys

- smoosh: flattens JSON structure to single level Object, chainable
- count: return number of times given predicate holds true

low level iterable for ES6+
