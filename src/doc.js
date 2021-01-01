import BFSStream from './bfs-stream';
import { splitPath } from './utils ';

function Doc(doc, options = {}) {
    this.options = {
        delimeter: options.delimeter || '.'
    };
    this.doc = doc;
}

Doc.prototype.getAt = function (path, opts = {}) {
    const splittedPath = splitPath(path, this.options.delimeter);
    let results = this.doc;
    let index = 0;

    while (splittedPath[index] !== undefined) {
        results = results[splittedPath[index]];

        if (results === undefined) {
            break;
        }

        index++;
    }

    if (opts.useConstructor) {
        return new Doc(results);
    } else {
        return results;
    }
};

Doc.prototype.setAt = function (path, val) {
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
    const stream = new BFSStream(this);

    while (!stream.eof()) {
        proc(stream.next(), this);
    }
};

Doc.prototype.prune = function (predicate) {
    const stream = new BFSStream(this);
    const results = new Doc({}, this.options);

    while (!stream.eof()) {
        const current = stream.next();

        if (predicate(current, this)) {
            results.setAt(current.path, current.value);
        }
    }

    return results;
};

export default Doc;