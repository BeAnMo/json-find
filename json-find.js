/* 
    JSON-Key-Search 
Small utility for searching through JSON or a JSON-compatible object for the
value at a given key. It no key exists, false is returned.     
*/

'use strict';

function isArray(v){
    return Array.isArray(v);
}

function isObject(v){
    return typeof(v) === 'object' && !isArray(v);
}

/* Object, String -> X or False 
    checks an object for a given key, if present
    return the key's value, else false  */
function checkKey(obj, key){
    
    /* Object, String -> X or False */
    function recurObj(parent, key){
        let keys = Object.keys(parent);
   
        return keys.reduce((acc, k) => {
            let val = parent[k];
            
            if(key === k){
                return acc || val;
                
            } else if(isArray(val)){
                return acc || recurArr(val, key);
                
            } else if(isObject(val)){
                return acc || recurObj(val, key);
                
            } else {
                return acc || false;
            }
            
        }, false);
    }
    
    /* Array, String -> X or False */
    function recurArr(arr, ky){
        return arr.reduce((acc, item) => {
        
            if(isArray(item)){
                return acc || recurArr(item, ky);
                
            } else if(isObject(item)){
                return acc || recurObj(item, ky);
                
            } else {
                return acc || false;
            }
            
        }, false);
    }
    
    return recurObj(obj, key);
}

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

                if(searchForObj[key]){
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


module.exports = {
    checkKey: checkKey,
    findValues: findValues
}
