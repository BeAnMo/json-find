/* 
    JSON-Find
Small utility for searching through JSON or a JSON-compatible object for values at
given keys.  
*/

'use strict';

/**** JSON document ***
    "this" assumes an Object or Array */
const JSON_DATA = Object.create({}, {
    checkKey: {
        configurable: false,
        enumerable: false,
        /* object at given key or false */
        value: function(key){
            return reduceJSON(false, this, (n, m) => m, key);
        }
    },
    findValues: {
        configurable: false,
        enumerable: false,
        /* object at given key or false */
        value: function(...keys){
            return findValues(this, ...keys);
        }
    },
    extractPaths: {
        configurable: false,
        enumerable: false,
        /* extract objects at given paths */
        value: function(useNewKeys, ...keys){
            return extractPaths(this, useNewKeys, ...keys);
        }
    }
});


/*** Constructor *** 
    JsonFind will return Atoms as is, Arrays & Objects are
    converted to JsonFind Object */
function JsonFind(doc){
    const possibleJson = JSON.stringify(doc);
    
    if(possibleJson === undefined){
        throw new Error('Object is invalid JSON');
    
    } else if(isAtom(doc) || doc === null){
        return doc;
    
    } else {
        return Object.assign(Object.create(JSON_DATA), doc);   
    }
}

let assignments = (() => {
    Object.assign(JsonFind, { prototype: JSON_DATA });
})();

module.exports = JsonFind;
    

/*** JSON_DATA methods ***/

/* Object, ...String -> Object
    searches through an object for all given keys,
    return an object of search keys & their values  */
function findValues(toSearch, ...searchFor){
    const results = {};
    
    const searches = ((search) => {
        let result = {};

        search.forEach((s) => {
            Object.assign(result, { [s]: true });
        });

        return result;
    })(searchFor);
    
    const recur = ((resultsObj, toSearchObj, keys) => {
        /* Object, Object -> Void */
        function recurObj(toSearchObj, searchForObj){
            const allKeys = Object.keys(toSearchObj);

            return allKeys.forEach((key) => {
                let val = toSearchObj[key];

                if(searchForObj[key] && !results[key]){
                    return Object.assign(resultsObj, { [key]: val });

                } else if(isObject(val)){
                    return recurObj(val, searchForObj);

                } else if(isArray(val)){
                    return recurArr(val, searchForObj);
                }
            });
        }
    
        /* Array, Object -> Void */
        function recurArr(arr, searchForObj){
            return arr.forEach((item) => {
                if(isArray(item)){
                    return recurArr(item, searchForObj);

                } else if(isObject(item)){
                    return recurObj(item, searchForObj);
                }
            });
        }
        
        return recurObj(toSearchObj, keys);
    })(results, toSearch, searches);

    return results;
}

/* applies function to value at given key */
function reduceJSON(accum, json, fn, searchFor){
    if(isKey(json, searchFor)){
        return fn(accum, json[searchFor]);
        
    } else if(isAtom(json)){
        return accum;
        
    } else if(isArray(json)){
        return json.reduce((acc, item) => {
            return reduceJSON(acc, item, fn, searchFor);
        }, accum);
        
    } else {
        const keys = Object.keys(json);
        
        return keys.reduce((acc, key) => {
            return reduceJSON(acc, json[key], fn, searchFor);
        }, accum);
    }
}

/* Object, Array-of-String, ...Array-of-String -> Object 
    extracts values from an object from multiples paths: 
    a Path is [...String] 
    assumes newKeys is false or [...String] */
function extractPaths(obj, newKeys, ...paths){
    const nkLen = newKeys.length;
    const pLen = paths.length;
    
    const curried = curry(assignKeysAtPaths, obj, newKeys, paths);

    return nkLen > pLen ?
        curried(nkLen) : curried(pLen);
}


/*** Helpers ***/

/* JSON, [...String], [...[...String]], Number -> Object */
function assignKeysAtPaths(obj, newKeys, paths, loopLen){
    let result = {};
    
    for(let i = 0; i < loopLen; i++){
        // allows for unequal newKeys/paths lengths
        const iPath = paths[i] ? 
            paths[i] : null;
        const iNewKey = newKeys[i] ? 
            newKeys[i] : paths[i].slice(-1);
        
        const objAtPath = iPath === null ? 
            null : recurPath(obj, iPath);
        const key = objAtPath ? 
            Object.keys(objAtPath)[0] : null;

        const curried = curry(Object.assign, result);

        // prevent same keys from overriding
        if(newKeys){
            if(objAtPath){
                curried({ [iNewKey]: objAtPath[key] });
            } else {
                curried({ [iNewKey]: objAtPath });
            }

        } else if(key in result){
            curried({ [key + '+' + i]: objAtPath[key] });
        
        } else {
            curried(objAtPath);
        }
    }

    return result;
}

/* Object, Array-of-String -> Object
    retrieves the value of an object at the given path
    returns { String-X: object }
    where String-X is the key from the last index of 
    the given array */
function recurPath(obj, arr, lastKey=''){
    if(arr.length === 0){
        return { [lastKey]: obj };
    } else {
        return recurPath(obj[arr[0]], arr.slice(1), arr[0]);
    }
}

/* [[...X -> Y], ...X -> [...Y -> Z]] -> Z */
function curry(fn, ...firstArgs){
    return function(...secondArgs){
        return fn.apply(null, firstArgs.concat(secondArgs));
    }
}

function isAtom(v){
    return (
        null === v ||
        typeof(v) === 'boolean' ||
        typeof(v) === 'number' ||
        typeof(v) === 'string'
    );
}

function isArray(v){
    return Array.isArray(v);
}

function isObject(v){
    return typeof(v) === 'object' && !isArray(v);
}

function isNull(v){
    return null === v ? "null" : v;
}

function isCompound(v){
   return isArray(v) || isObject(v); 
}

function isKey(json, searchFor){
    if(json === null){
        return false;
    } else {        
        return isCompound(json) && searchFor in json;
    }  
}
