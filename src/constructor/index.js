import { flatFold } from '../fold';
import { findValues } from '../findValues';
import { isAtom, isNull } from '../utils';

const JSON_DATA = Object.create(
  {},
  {
    flatFold: {
      configurable: false,
      enumerable: false,
      value: function(proc, acc) {
        return flatFold(acc, this, proc);
      }
    },
    findValues: {
      configurable: false,
      enumerable: false,
      value: function(...keys) {
        return findValues(this, ...keys);
      }
    }
  }
);

function JsonFind(doc) {
  const possibleJson = JSON.stringify(doc);

  if (possibleJson === undefined) {
    throw new Error('Object is invalid JSON');
  } else if (isAtom(doc) || isNull(doc)) {
    return doc;
  } else {
    return Object.assign(Object.create(JSON_DATA), doc);
  }
}

JsonFind.prototype = JSON_DATA;

export default JsonFind;
