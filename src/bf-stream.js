import Queue from './queue';
import { last, splitPath, isCompound } from './utils';

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


export default BFStream;