const jsf = require('../json-find'),
      assert = require('assert'),
      path = require('path'),
      fs = require('fs');
      

const MESSAGE = (key) => `Test for ${key} failed`;  
const TESTS = [
    { // first item in obj
        test: 'strictEqual',
        actual: runActual('version'),
        expected: '0.6',
        msg: MESSAGE('version')
    },
    {
        test: 'deepStrictEqual',
        actual: runActual("orgAbbr"),
        expected: "NPR",
        msg: MESSAGE('refId')
    },
    { // deeply nested, empty object
        test: 'deepStrictEqual',
        actual: runActual('rightsHolder'),
        expected: {},
        msg: MESSAGE('rightsHolder')
    },
    { // first of several identical keys, array
        test: 'deepStrictEqual',
        actual: runActual('link'),
        expected: [{"type": "html",
                          "$text": "http://api.npr.org/templates/story/story.php?storyId=91280049&f=91280049&ft=3"},
                          {"type": "api",
                           "$text": "http://api.npr.org/query?id=91280049"}],
        msg: MESSAGE('link')
    },
    { // first of several identical keys
        test: 'strictEqual',
        actual: runActual('id'),
        expected: '91280049',
        msg: MESSAGE('id')
    },
    { // object
        test: 'deepStrictEqual',
        actual: runActual('slug'),
        expected: {"$text": "Interviews"},
        msg: MESSAGE('slug')
    },
    { // deeply nested, single object contains multiple identical keys
      // returns the value of the last key
        test: 'strictEqual',
        actual: runActual('refId'),
        expected: '91281102', // last key in object
        msg: MESSAGE('refId, last key')
    },
    {
        test: 'notStrictEqual',
        actual: runActual('refId'),
        expected: undefined, // value is '91281096'
        msg: MESSAGE('refId, first key')
    }
]
     
     
function runActual(key){
    return function(json){
        return jsf.checkKey(json, key);
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
