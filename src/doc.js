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
    if (!pathStr) {
        return this.doc;
    }

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

Doc.prototype.fold = function (proc, acc) {
    const stream = new BFStream(this.doc, this.options.delimeter);
    let results = acc;

    while (!stream.empty()) {
        results = proc.call(this, results, stream.next());
    }

    return results;
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

Doc.prototype.smoosh = function(){
    const stream = new BFStream(this.doc, this.options.delimeter);
    const results = {}

    while (!stream.empty()) {
        const { path, value} = stream.next();

        results[path.toString()] = value;
    }

    return new Doc(results, this.options);
}

Doc.prototype.toggle = function () {
    let converted = this.doc;

    if (isArray(this.doc)) {
        converted = Object.keys(this.doc)
            .reduce((acc, k) => {
                acc[k] = this.doc[k];

                return acc;
            }, {});

    } else {
        converted = Object.keys(this.doc)
            .map((k) => {
                return [k, this.doc[k]];
            }, {});
    }

    return new Doc(converted, this.options);
};

Doc.getBase = function (doc) {
    return isArray(doc) ? [] : {};
};

Doc.clone = function (doc, options) {
    const delim = options && options.delimeter || '.';
    const stream = new BFStream(doc, delim);
    const results = Doc.getBase(doc);

    while (!stream.empty()) {
        const current = stream.next();

        setAtPath(results, current.path.toArray(), current.value);
    }

    return results;
};

export default Doc;