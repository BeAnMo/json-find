import { isCompound } from '../utils';

/**
 * @description Mimicks Array.reduce, but can iterate over
 * Array & Objects.
 */
export function fold(accum, collection, fn) {
  // converts array indexes to [...String]
  // eliminates need to check type
  // ...though if accum is an Array, could
  // be optimized with Array.push
  // Alternatively, if an Object has not prototype
  // could use for..in for both Object/Array
  const keys = Object.keys(collection);
  let acc = accum;

  for (const key of keys) {
    acc = fn(acc, collection[key], key);
  }

  return acc;
}

function fold_bf(collection, proc, accum) {
  let queue = Queue();

  const pushMany = (path, keys) => {
    for (const key of keys) {
      queue.push(`${path}${key}`);
    }
  };

  pushMany('', Object.keys(collection));

  while (!queue.isEmpty()) {
    const path = queue.pop();
    const itemAtPath = getAt(collection, path);

    if (isCompound(itemAtPath)) {
      pushMany(`${path}.`, Object.keys(itemAtPath));
    } else {
      accum = proc(accum, itemAtPath, path);
    }
  }

  return accum;
}

/**
 * function Doc(obj){
  return {
    ...obj,
    [Symbol.iterator](){
      return fold_bf_gen(this)
    }
  }
}
 */

function* fold_bf_gen(collection, delim = '.') {
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
    const itemAtPath = getAt(collection, path);
    const isCollection = isCompound(itemAtPath);

    if (isCollection) {
      pushMany(`${path}.`, Object.keys(itemAtPath));
    }

    yield {
      path: path,
      key: path.split(delim).slice(-1)[0],
      value: itemAtPath,
      isCollection
    };
  }
}

function Queue() {
  let q = [];
  let len = 0;

  let self = {
    push(item) {
      len = q.push(item);

      return self;
    },
    pop() {
      if (len === 0) {
        return null;
      } else {
        const [first, ...rest] = q;

        q = rest;
        len -= 1;

        return first;
      }
    },
    isEmpty() {
      return len === 0;
    }
  };

  return self;
}

function getAt(collection, path, delim = '.') {
  const splitPath = path.split(delim);
  let result = collection;

  for (const p of splitPath) {
    result = result[p];

    if (result === undefined) {
      return result;
    }
  }

  return result;
}
