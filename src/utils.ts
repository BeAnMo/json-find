import { Json, Key } from './types';

export function isAtom<T>(v: Json<T>): Boolean {
  return (
    v === null ||
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'string'
  );
}

export function isArray<T>(v: Json<T>): Boolean {
  return Array.isArray(v);
}

export function isObject<T>(v: Json<T>): Boolean {
  return typeof v === 'object' && !isArray(v) && v !== null;
}

export function isNull<T>(v: Json<T>): Boolean {
  return v === null;
}

export function isCompound<T>(v: Json<T>): Boolean {
  return isArray(v) || isObject(v);
}

export function isKey<T>(json: Json<T>, searchFor: Key) {
  return json === null ? false : isCompound(json) && json[searchFor];
}
