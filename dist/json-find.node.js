'use strict';

function Queue() {
    this.q = [];
    this.L = 0;
}

Queue.prototype.push = function (item) {
    this.L = this.q.push(item);

    return this;
};

Queue.prototype.pop = function () {
    const [first, ...rest] = this.q;

    this.q = rest;

    if (this.L > 0) {
        this.L -= 1;
    }

    return first;
};

Queue.prototype.empty = function () {
    return this.L === 0;
};

/**
 * @param {Object | Array} obj 
 * @param {string[]} path 
 * 
 * @returns {any}
 */
function getAtPath(obj, path) {
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
function setAtPath(obj, path, value) {
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

function last(arr) {
    return arr[arr.length - 1];
}

function isArray(v) {
    return Array.isArray(v);
}

function isObject(v) {
    return typeof v === 'object' && !isArray(v) && v !== null;
}

function isCompound(v) {
    return isArray(v) || isObject(v);
}

function splitPath(path, delim = '.') {
    return path.split(delim);
}

function BFStream(doc, delimeter) {
    this.doc = doc;
    this.delim = delimeter;
    this.q = new Queue();

    // Load up the queue on instantiation.
    this.setQueue('', Object.keys(this.doc));
}

BFStream.prototype.setQueue = function (path, keys) {
    keys.forEach(key => {
        const keyPath = `${path}${key}`;

        this.q.push(keyPath);
    });

    return this;
};

BFStream.prototype.splitPath = function (pathStr) {
    return splitPath(pathStr, this.delim);
};

BFStream.prototype.getCurrentKey = function (path) {
    return last(this.splitPath(path));
};

BFStream.prototype.getAtPath = function (path) {
    return getAtPath(this.doc, this.splitPath(path));
};

BFStream.prototype.next = function () {
    const path = this.q.pop();
    const value = this.getAtPath(path);

    if (!isCompound(value)) {
        return {
            path,
            value,
            key: this.getCurrentKey(path)
        };
    } else {
        this.setQueue(`${path}${this.delim}`, Object.keys(value));

        return this.next();
    }
};

BFStream.prototype.empty = function () {
    return this.q.empty();
};

/**
 * @param {Object | Array} doc 
 * @param {{ delimeter?: string, useConstructor?: boolean }} options 
 */
function Doc(doc, options = {}) {
    if (!isCompound(doc)) {
        throw new Error(`Instantiating JsonFind requires an Object or an Array.`);
    }

    this.options = {
        delimeter: options.delimeter || '.',
        useConstructor: options.useConstructor || false
    };
    this.doc = doc;
}

/**
 * @param {string} pathStr
 * @param {{ useConstructor?: boolean }=} opts
 */
Doc.prototype.get = function (pathStr, opts = {}) {
    const useConstructor = opts.useConstructor || this.options.useConstructor;
    const path = splitPath(pathStr, this.options.delimeter);
    const result = getAtPath(this.doc, path);

    if (useConstructor && isCompound(result)) {
        return new Doc(result, this.options);

    } else {
        return result;
    }
};

Doc.prototype.set = function (pathStr, val) {
    const path = splitPath(pathStr, this.options.delimeter);

    setAtPath(this.doc, path, val);

    return this;
};

Doc.prototype.each = function (proc) {
    const stream = new BFStream(this.doc, this.options.delimeter);

    while (!stream.empty()) {
        proc.call(this, stream.next());
    }
};

Doc.prototype.prune = function (predicate) {
    const stream = new BFStream(this.doc, this.options.delimeter);
    const results = new Doc(Doc.getBase(this.doc), this.options);

    while (!stream.empty()) {
        const current = stream.next();

        if (predicate.call(this, current)) {
            results.set(current.path, current.value);
        }
    }

    return results;
};

Doc.getBase = function (doc) {
    return isArray(doc) ? [] : {};
};

Doc.clone = function (doc, options) {
    const delim = options && options.delimeter || '.';
    const stream = new BFStream(doc, delim);
    let results = Doc.getBase(doc);

    while (!stream.empty()) {
        const current = stream.next();

        setAtPath(results, splitPath(current.path, delim), current.value);
    }

    return results;
};

module.exports = Doc;
