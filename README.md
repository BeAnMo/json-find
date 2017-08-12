# JSON-FIND

The goal of the module is provide easy access to JSON or JSON-compatible* values. This is not intended for complex JSON queries, but rather for retrieving specifc values without the need to constantly reference a file's structure. In other words, if you are treating JSON as a database and making multiple queries on the same file, this is not for you. However, if you need to get information from JSON data such as from reasonably consistent web API calls where the structure of the data can undergo subtle structural changes, then this module aims to provide a convenient way to access that data.

*a JSON-compatible object means the contents of the object can only be:
- Booleans
- Numbers
- Strings
- Objects (of valid JSON)
- Arrays (of valid JSON)


### API

#### .checkKey(Object, String) -> JSON or False

Returns the value of a given Object at the specified key, false otherwise.


#### .findValues(Object, ...String) -> Object
    
Searches the given Object for each key given. If a given key exists in the Object, its key/value pair
are copied to the resulting Object. If none are matched, an empty Object is returned.


If given an Object with multiple identical keys, both procedures will return the first matching key found, ignoring the others. However, if identical keys exist on the same level within an Object, the value of the last key will be returned.

#### Example

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
    
    jsf.checkKey(test, 'g');        // false
    jsf.checkKey(test, 'e');        // 5
    jsf.checkKey(test.c, 'e');      // 5
    jsf.checkKey(test.c[2].f, 'e'); // 8
    
    jsf.findValues(test, 'z');      // {}
    jsf.findValues(test, 'z', 'd'); // { "d": 7 }
    jsf.findValues(test, 'a', 'd'); // { "a": 1, "d": 7 }
    jsf.findValues(test, 'a', 'd'); // { "a": 1, "d": 7 }
    
    // only test.d is found, not test.c[2].d
    jsf.findValues(test, 'd', 'e'); // { "d": 7, "e": 8 }
    

For a better idea of real world applications consult the tests.


### Considerations
- Retrieve all values for a given key
- List path to an key/value
