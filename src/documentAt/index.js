/**
 * @description Mutates the given document
 * at the path with val.
 *
 * @param {Object} doc
 * @param {[String|Number]} path
 * @param {Object} val
 *
 * @return {Object} the mutated original
 */
export function setDoc(doc, path, val) {
  let cursor = doc;
  let index = 0;

  while (path[index + 1] !== undefined) {
    const next = path[index];

    if (cursor[next] === undefined) {
      // In order to determine the shape of the next cursor,
      // this step needs to know whether the next path value is
      // an array index or object key.
      cursor = cursor[next] = isNaN(path[index + 1]) ? {} : [];
    } else {
      cursor = cursor[next];
    }

    index++;
  }

  cursor[path[index]] = val;

  return doc;
}

/**
 * @param {Object} collection
 * @param {[String]} splittedPath
 */
export function getDoc(collection, splittedPath) {
  let result = collection;
  let index = 0;

  while (splittedPath[index] !== undefined) {
    result = result[splittedPath[index]];

    if (result === undefined) {
      return result;
    }

    index++;
  }

  return result;
}
