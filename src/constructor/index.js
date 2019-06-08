import { getDoc, setDoc } from './documentAt';

const DOCUMENT = {
  [Symbol.iterator]() {
    return fold_bf_gen(this, this.config.delimeter, this.config.onlyPrimitives);
  },

  at(key, maybeUpdate = false) {
    const path = key.split(this.config.delimeter);

    if (maybeUpdate !== undefined) {
      return setDoc(this, path, maybeUpdate);
    } else {
      return getDoc(this, path);
    }
  },
  // ~= Array.reduce
  fold(proc, accum) {
    let acc = accum;

    for (const { value, key, path } of this) {
      acc = proc(acc, value, key, path);
    }

    return acc;
  },
  // ~= Array.filter
  prune(predicate) {
    let result = Doc({}, this.config);

    for (const { value, key, path } of this) {
      if (predicate(value, key, path)) {
        result.set(path, value);
      }
    }

    return result;
  },

  // ~= Array.map
  transform(proc) {
    let result = Doc({}, this.config);

    for (const { value, key, path } of this) {
      result.set(path, proc(value, key, path));
    }

    return result;
  },

  // ~= Array.forEach
  each(proc) {
    for (const { value, key, path } of this) {
      proc(value, key, path);
    }

    return this;
  },

  // ~= Array.some
  orAll(predicate) {
    for (const { value, key, path } of this) {
      if (predicate(value, key, path)) {
        return true;
      }
    }

    return false;
  },

  andAll(predicate) {
    for (const { value, key, path } of this) {
      if (!predicate(value, key, path)) {
        return false;
      }
    }

    return true;
  },

  smoosh() {
    let result = Doc({}, this.config);

    for (const { value, path } of this) {
      result.set(path, value);
    }

    return result;
  },

  // ~= kinda like Array.length
  count(predicate) {
    let C = 0;

    for (const { value, key } of this) {
      if (predicate(value, key, path)) {
        C += 1;
      }
    }

    return C;
  }
};

function Doc(any, { onlyPrimitives = true, onlyJson = true, delimeter = '.' }) {
  return Object.assign(
    Object.create(DOCUMENT, {
      config: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: {
          onlyPrimitives,
          onlyJson,
          delimeter
        }
      }
    }),
    any
  );
}
