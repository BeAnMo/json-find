import Queue from './queue';
import { last, splitPath, isCompound, getAtPath } from './utils';

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


export default BFStream;