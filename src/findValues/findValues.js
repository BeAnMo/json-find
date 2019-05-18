import { isObject, isArray } from '../utils';

/**
 * @description Searches through an object for all given keys and
 * returns an object of the given keys & their values
 *
 * @param {String} toSearch
 * @param {String} searchFor
 *
 * @return {{[String]: Object }}
 */
export default function findValues(toSearch, ...searchFor) {
  const searchesLen = searchFor.length;
  let results = {};
  let searches = {};

  for (let i = 0; i < searchesLen; i++) {
    searches[searchFor[i]] = true;
  }

  /* Object, Object -> Void */
  function traverseObject(toSearchObj, searchForObj) {
    const allKeys = Object.keys(toSearchObj);
    const len = allKeys.length;

    for (let i = 0; i < len; i++) {
      const key = allKeys[i];
      const val = toSearchObj[key];

      if (searchForObj[key] && !results[key]) {
        results[key] = val;
      } else if (isObject(val)) {
        traverseObject(val, searchForObj);
      } else if (isArray(val)) {
        traverseArray(val, searchForObj);
      }
    }
  }

  /* Array, Object -> Void */
  function traverseArray(arr, searchForObj) {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      const item = arr[i];

      if (isArray(item)) {
        traverseArray(item, searchForObj);
      } else if (isObject(item)) {
        traverseObject(item, searchForObj);
      }
    }
  }

  traverseObject(toSearch, searches);

  return results;
}
