export function Queue() {
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

export function isAtom(v) {
  return (
    null === v ||
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'string'
  );
}

export function isArray(v) {
  return Array.isArray(v);
}

export function isObject(v) {
  return typeof v === 'object' && !isArray(v) && v !== null;
}

export function isNull(v) {
  return null === v ? 'null' : v;
}

export function isCompound(v) {
  return isArray(v) || isObject(v);
}

export function isKey(json, searchFor) {
  return json === null ? false : isCompound(json) && searchFor in json;
}

export function splitPath(path, delim = '.') {
  return path.split(delim);
}
