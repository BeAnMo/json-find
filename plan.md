# Game plan

### Interface

current instantiation:

- pass doc to JsonFind

planned instantiation:

- pass doc to JsonFind
- pass config to JsonFind
  - delimiter: custom delim
  - onlyJson: Boolean - can only be used on valid JSON
    otherwise can work with circular structures (like the DOM)
  -

current methods:

- findValues: keep functionality but rename?
- checkKey: remove
- extractPaths: replace functionality w/ some ability to rename fields & retrieve at
  a given path

planned methods:

- flatFold: equivalent to Array.reduce, works on Arrays/Objects
- deepFold: traverses entire doc depth-first

(maybe a single fold function, let the user decided whether flat/deep)

- findAll(?): find all occurences that hold when the given predicate is applied
- rename(?): returns a new copy of the given doc, where certain fields have been
  renamed
- flatten: flattens a nested structure to a flat Object whose keys are paths
- count: count occurences of a given key or keys
- removeCircular(?): removes circular references within a document
