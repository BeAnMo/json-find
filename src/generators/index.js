import { isCompound, Queue, splitPath } from '../utils';
import { getDoc } from '../documentAt';

/**
 * @description A generator that yields all of the
 * non-compound elements within a collection.
 * @param {Object} collection
 * @param {String} delim
 */
export default function* primitive_bfs_gen(collection, delim) {
  let pathQueue = Queue();

  const setQueue = (path, keys) => {
    for (const key of keys) {
      const keyPath = `${path}${key}`;
      // check for cyclic references
      pathQueue.push(keyPath);
    }
  };

  const adjustPath = path => splitPath(path, delim).slice(-1)[0];
  const getAt = path => getDoc(collection, splitPath(path, delim));

  setQueue('', Object.keys(collection));

  while (!pathQueue.isEmpty()) {
    const path = pathQueue.pop();
    const itemAtPath = getAt(path);
    const isCollection = isCompound(itemAtPath);

    if (isCollection) {
      setQueue(`${path}${delim}`, Object.keys(itemAtPath));
    } else {
      yield {
        path: path,
        value: itemAtPath,
        key: adjustPath(path)
      };
    }
  }
}
