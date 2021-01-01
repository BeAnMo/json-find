import BFStream from './bf-stream';
import { splitPath, isCompound } from './utils';

function Doc(doc, options = {}) {
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
Doc.prototype.getAt = function (pathStr, opts = {}) {
    const useConstructor = opts.useConstructor || this.options.useConstructor;
    const path = splitPath(pathStr, this.options.delimeter);
    let results = this.doc;
    let index = 0;

    while (path[index] !== undefined) {
        results = results[path[index]];

        if (results === undefined) {
            break;
        }

        index++;
    }

    if (isCompound(results) && useConstructor) {
        return new Doc(results, this.options);

    } else {
        return results;
    }
};

Doc.prototype.setAt = function (pathStr, val) {
    const path = splitPath(pathStr, this.options.delimeter);
    let cursor = this.doc;
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

    cursor[path[index]] = val;

    return this;
};

Doc.prototype.each = function (proc) {
    const stream = new BFStream(this);

    while (!stream.empy()) {
        proc.call(this, stream.next());
    }
};

Doc.prototype.prune = function (predicate) {
    const stream = new BFStream(this);
    const results = new Doc({}, this.options);

    while (!stream.empty()) {
        const current = stream.next();

        if (predicate.call(this, current)) {
            results.setAt(current.path, current.value);
        }
    }

    return results;
};

export default Doc;