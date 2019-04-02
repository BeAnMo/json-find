import { isArray } from '../utils';

/**
 * Behold the might of Fold!
 *
 * Technically this is foldL.
 * It mimics Array.reduce in that
 * it traverse Arrays [L,..., R]
 * (left to right).
 *
 * No plans for Array.reduceRight,
 * because I assume Object keys do not
 * maintain order (even if they actually do).
 */
export default function flatFold(accum, collection, proc) {
  let acc = accum;

  if (isArray(collection)) {
    let index = 0;

    for (const item of collection) {
      acc = proc(acc, item, index);
    }
  } else {
    const keys = Object.keys(collection);

    for (const key of keys) {
      acc = proc(acc, collection[key], key);
    }
  }

  return acc;
}
