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

/* Object, String -> X or False */
function findValueAtKey(obj, key){
    
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


module.exports = {
    valAtKey: findValueAtKey
}
