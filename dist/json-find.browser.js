var JsonFind = (function () {
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

    function BFStream(docInstance) {
        this.docInstance = docInstance;
        this.delim = docInstance.options.delimeter;
        this.q = new Queue();

        // Load up the queue on instantiation.
        this.setQueue('', Object.keys(docInstance.doc));
    }

    BFStream.prototype.setQueue = function (path, keys) {
        keys.forEach(key => {
            const keyPath = `${path}${key}`;

            this.q.push(keyPath);
        });

        return this;
    };

    BFStream.prototype.getCurrentKey = function (path) {
        return last(splitPath(path, this.delim));
    };

    BFStream.prototype.getAtPath = function (path) {
        return this.docInstance.getAt(path, { noInstance: true });
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

        while (!stream.empty()) {
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

    return Doc;

}());
