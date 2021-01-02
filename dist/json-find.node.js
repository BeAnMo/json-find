'use strict';

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

function JsonPath(aPath, delimiter) {
    this.delimiter = delimiter;

    if (isArray(aPath)) {
        this.path = aPath;
    } else {
        this.path = aPath.split(this.delimiter);
    }
}

JsonPath.prototype.toString = function () {
    return this.path.join(this.delimiter);
};

JsonPath.prototype.toArray = function () {
    return this.path;
};

JsonPath.prototype.clone = function () {
    return new JsonPath([...this.path], this.delimiter);
};

JsonPath.prototype.slice = function (from, to) {
    return new JsonPath(this.path.slice(from, to), this.delimiter);
};

JsonPath.prototype.append = function (key) {
    this.path.push(key);

    return this;
};

function BFStream(doc, delimeter) {
    this.doc = doc;
    this.delim = delimeter;
    // The queue contains JsonPaths.
    this.q = [];

    // Load up the queue on instantiation.
    this.setQueue(new JsonPath([], this.delim), Object.keys(this.doc));
}

BFStream.prototype.setQueue = function (path, keys) {
    keys.forEach(key => {
        const keyPath = path.clone().append(key);
    
        this.q.push(keyPath);
    });

    return this;
};

BFStream.prototype.next = function () {
    const path = this.q.shift();
    const value = getAtPath(this.doc, path.toArray());

    if (!isCompound(value)) {
        return {
            path,
            value,
            key: path.slice(-1).toString()
        };
    } else {
        this.setQueue(path, Object.keys(value));

        return this.next();
    }
};

BFStream.prototype.empty = function () {
    return this.q.length === 0;
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

Doc.prototype.dump = function () {
    return this.doc;
};

Doc.prototype.each = function (proc) {
    const stream = new BFStream(this.doc, this.options.delimeter);

    while (!stream.empty()) {
        proc.call(this, stream.next());
    }
};

Doc.prototype.transform = function (proc) {
    const stream = new BFStream(this.doc, this.options.delimeter);
    const results = new Doc(Doc.getBase(this.doc), this.options);

    while (!stream.empty()) {
        const current = stream.next();

        results.set(current.path.toArray(), proc.call(this, current));
    }

    return results;
};

Doc.prototype.prune = function (predicate) {
    const stream = new BFStream(this.doc, this.options.delimeter);
    const results = new Doc(Doc.getBase(this.doc), this.options);

    while (!stream.empty()) {
        const current = stream.next();

        if (predicate.call(this, current)) {
            results.set(current.path.toString(), current.value);
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

        setAtPath(results, current.path.toArray(), current.value);
    }

    return results;
};

module.exports = Doc;
