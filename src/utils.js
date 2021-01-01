export function last(arr) {
    return arr[arr.length - 1];
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

export function splitPath(path, delim = '.') {
    return path.split(delim);
}