const jsf = require('../json-find'),
      assert = require('assert'),
      path = require('path'),
      fs = require('fs');
      
/*
test:
- test: String
- actual: runActual(JSF-method, ...String),
- expected: any,
- msg: MESSAGE(String)
*/


const MESSAGE = (key) => `Test for ${key} failed`;  
const TESTS = [
    { // first item in obj
        test: 'strictEqual',
        actual: runActual('checkKey', 'version'),
        expected: '0.6',
        msg: MESSAGE('version')
    },
    {
        test: 'deepStrictEqual',
        actual: runActual('checkKey', "orgAbbr"),
        expected: "NPR",
        msg: MESSAGE('refId')
    },
    { // deeply nested, empty object
        test: 'deepStrictEqual',
        actual: runActual('checkKey', 'rightsHolder'),
        expected: {},
        msg: MESSAGE('rightsHolder')
    },
    { // first of several identical keys, array
        test: 'deepStrictEqual',
        actual: runActual('checkKey', 'link'),
        expected: [{"type": "html",
                          "$text": "http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3"},
                          {"type": "api",
                           "$text": "http://api.npr.org/query?id=91280049"}],
        msg: MESSAGE('link')
    },
    { // first of several identical keys
        test: 'strictEqual',
        actual: runActual('checkKey', 'id'),
        expected: '91280049',
        msg: MESSAGE('id')
    },
    { // object
        test: 'deepStrictEqual',
        actual: runActual('checkKey', 'slug'),
        expected: {"$text": "Interviews"},
        msg: MESSAGE('slug')
    },
    { // deeply nested, single object contains multiple identical keys
      // returns the value of the last key
        test: 'strictEqual',
        actual: runActual('checkKey', 'refId'),
        expected: '91281102', // last key in object
        msg: MESSAGE('refId, last key')
    },
    {
        test: 'notStrictEqual',
        actual: runActual('checkKey', 'refId'),
        expected: undefined, // value is '91281096'
        msg: MESSAGE('refId, first key')
    },
    {
        test: 'deepStrictEqual',
        actual: runActual('findValues', 'version'),
        expected: {"version": "0.6"}, // value is '91281096'
        msg: MESSAGE('version')
    },
    { // retrieves first values only
        test: 'deepStrictEqual',
        actual: runActual('findValues', 'title', 'teaser'),
        expected: {"title": {"$text": "Stories from NPR"}, "teaser": {"$text": "Assorted stories from NPR"}},
        msg: MESSAGE('title & teaser')
    },
    { // $text was already retrieved by 'title', so first $text encountered is nested in 'teaser'
        test: 'deepStrictEqual',
        actual: runActual('findValues', 'title', '$text'),
        expected: {"title": {"$text": "Stories from NPR"}, "$text": "Assorted stories from NPR"},
        msg: MESSAGE('title & $text')
    },
    {
        test: 'deepStrictEqual',
        actual: runActual('findValues', 'titles', 'teasers'),
        expected: {},
        msg: MESSAGE('none')
    },
    {
        test: 'deepStrictEqual',
        actual: runActual('findValues', 'what', 'link', 'subtitle'),
        expected: {"link": [{"type": "html",
                          "$text": "http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3"},
                          {"type": "api",
                           "$text": "http://api.npr.org/query?id=91280049"}], "subtitle": {}},
        msg: MESSAGE('link & subtitle')
    }
]
     
     
function runActual(method, ...keys){
    return function(json){
        if(method === 'checkKey'){
            return jsf[method](json, keys[0]);
        } else {
            return jsf[method](json, ...keys);
        }
    }
}

function runTests(json){
    const len = TESTS.length;
    let passed = 0;
    
    TESTS.forEach((T) => { 
        let tested = assert[T.test](T.actual(json), T.expected, T.msg);
        
        if(tested === undefined){
            passed++
        }
    });
    
    return console.log(`${len - passed} tests failed out of ${len}`);
}

function readJSON(file){
    return new Promise((success, failure) => {
        let currentPath = path.resolve('./test/' + file);
        console.log('testing with ', currentPath);
        fs.readFile(currentPath, 'utf-8', (err, data) => {
            return err ? failure(err) :
                         success(JSON.parse(data));
        });
    });
}


// run tests
((file) => {
    readJSON(file)
        .then(runTests)
        .catch(console.error);
})('./npr.json');
