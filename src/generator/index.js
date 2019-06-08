import { isCompound, Queue } from '../utils';

/**
 * @param {Object} collection
 * @param {String} delim
 * @param {Boolean} onlyPrimitives
 */
export function* fold_bf_gen(collection, delim, onlyPrimitives) {
  let queue = Queue();

  const pushMany = (path, keys) => {
    for (const key of keys) {
      const keyPath = `${path}${key}`;

      if (false) {
        // check for cyclic ref
        console.warn(`circular reference @${keyPath}`);
      } else {
        queue.push(keyPath);
      }
    }
  };

  pushMany('', Object.keys(collection));

  while (!queue.isEmpty()) {
    const path = queue.pop();
    const itemAtPath = at(collection, path);
    const isCollection = isCompound(itemAtPath);

    if (isCollection) {
      pushMany(`${path}${delim}`, Object.keys(itemAtPath));
    }

    /**
     * only prim AND is a collection - no yield
     * negated:
     * NOT only prim OR is NOT a collection - yield
     */

    if (!onlyPrimitives || !isCollection) {
      yield {
        path: path,
        key: path.split(delim).slice(-1)[0],
        value: itemAtPath,
        isCollection
      };
    }
  }
}

function at(collection, path, delim) {
  const splitPath = path.split(delim);
  let result = collection;
  let index = 0;

  while (splitPath[index]) {
    result = result[splitPath[index]];

    if (result === undefined) {
      return result;
    }
  }

  return result;
}
