# JSON-FIND

The goal of the module is provide easy access to JSON or JSON-compatible* values. This is not intended for complex JSON queries, but rather for retrieving specifc values without the need to constantly reference a file's structure. In other words, if you are treating JSON as a database and making multiple queries on the same file, this is not for you. However, if you need to get information from JSON data such as from reasonably consistent web API calls where the structure of the data can undergo subtle structural changes, then this module aims to provide a convenient way to access that data.

*a JSON-compatible object means the contents of the object can only be:
- Booleans
- Numbers
- Strings
- Objects (of valid JSON)
- Arrays (of valid JSON)


### API

    JSON-FIND.valAtKey(Object, String)

Returns the value of a given object at the specified key, or false.


Example:

    const jsf = require('json-find');

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
    
    jsf.valAtKey(test, 'g');        // false
    jsf.valAtkey(test, 'e');        // 5
    jsf.valAtKey(test.c, 'e');      // 5
    jsf.valAtKey(test.c[2].f, 'e'); // 8
    
For a better idea of real world applications consult the tests.


### Considerations
- Retrieve all values for a given key
- Retrieve a key/path to a given value or a given key
