import BFStream from './bf-stream';
import { splitPath, isCompound, getAtPath, setAtPath, isArray } from './utils';

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

export default Doc;