import { getDoc, setDoc } from '../documentAt';
import primitive_bfs_gen from '../generators';

const DOCUMENT = {
  [Symbol.iterator]() {
    return primitive_bfs_gen(this, this.config.delimeter);
  },
  // getter & setter (set is chainable)
  at(key, maybeValue = undefined) {
    const path = key.split(this.config.delimeter);

    if (maybeValue === undefined) {
      return getDoc(this, path);
    } else {
      return setDoc(this, path, maybeValue);
    }
  },

  toString() {
    return JSON.stringify(this);
  },
  // ~= Array.reduce (chainable if acc is Doc)
  fold(proc, accum) {
    let acc = accum;

    for (const { value, key, path } of this) {
      acc = proc(acc, value, key, path);
    }

    return acc;
  },
  // ~= Array.filter (chainable)
  prune(predicate) {
    let result = Doc({}, this.config);

    for (const { value, key, path } of this) {
      if (predicate(value, key, path)) {
        result.at(path, value);
      }
    }

    return result;
  },

  // ~= Array.map (chainable)
  transform(proc) {
    let result = Doc({}, this.config);

    for (const { value, key, path } of this) {
      result.at(path, proc(value, key, path));
    }

    return result;
  },

  // ~= Array.forEach (chainable)
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

  // ~= Array.flatten (chainable)
  smoosh() {
    let result = Doc({}, this.config);

    for (const { value, path } of this) {
      result.at(path, value);
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

const DEFAULT_CONFIG = { onlyPrimitives: true, onlyJson: true, delimeter: '.' };

export default function Doc(any, conf = DEFAULT_CONFIG) {
  const { onlyJson, onlyPrimitives, delimeter } = conf;

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
