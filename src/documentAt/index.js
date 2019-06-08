/**
 * @description Mutates the given document
 * at the path with val.
 *
 * @param {Object} doc
 * @param {[String]} path
 * @param {Object} val
 */
export function setDoc(doc, path, val) {
  let cursor = doc;
  let index = 0;

  while (path[index + 1]) {
    const next = path[index];

    // need to maintain arrays
    if (cursor[next] === undefined) {
      cursor = cursor[next] = isNaN(next) ? {} : [];
    } else {
      cursor = cursor[next];
    }

    index++;
  }

  cursor[path[index]] = val;

  return doc;
}

/**
 * @description Retrieves the value of the document
 * at the given path.
 *
 * @param {Object} doc
 * @param {[String]} path
 */
export function getDoc(doc, path) {
  let cursor = doc;

  for (const next of path) {
    cursor = cursor[next];
  }

  return cursor;
}
