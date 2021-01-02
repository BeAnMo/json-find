/**
 * @param {Object | Array} obj 
 * @param {string[]} path 
 * 
 * @returns {any}
 */
export function getAtPath(obj, path) {
    let cursor = obj;
    let index = 0;

    while (path[index] !== undefined) {
        cursor = cursor[path[index]];

        if (cursor === undefined) {
            break;
        }

        index++;
    }

    return cursor;
}

/**
 * 
 * @param {Object | Array} obj 
 * @param {string[]} path 
 * @param {any} value 
 * 
 * @returns {Object | Array}
 */
export function setAtPath(obj, path, value) {
    let cursor = obj;
    let index = 0;

    while (path[index + 1] !== undefined) {
        const next = path[index];

        if (cursor[next] === undefined) {
            // In order to determine the shape of the next cursor,
            // this step needs to know whether the next path value is
            // an array index or object key.
            cursor = cursor[next] = isNaN(path[index + 1]) ? {} : [];
        } else {
            cursor = cursor[next];
        }

        index++;
    }

    cursor[path[index]] = value;

    return cursor;
}

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