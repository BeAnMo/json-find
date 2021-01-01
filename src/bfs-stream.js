import Queue from './queue';
import { last, splitPath } from './utilss';

function BFSStream(jdoc) {
    this.jdoc = jdoc;
    this.delim = jdoc.options.delimeter;
    this.q = new Queue();

    // Load up the queue on instantiation.
    this.setQueue('', Object.keys(jdoc.doc));
}

BFSStream.prototype.setQueue = function (path, keys) {
    keys.forEach(key => {
        const keyPath = `${path}${key}`;

        this.q.push(keyPath);
    });

    return this;
};

BFSStream.prototype.getCurrentKey = function (path) {
    return last(splitPath(path, this.delim));
};

BFSStream.prototype.getAtPath = function (path) {
    return this.jdoc.getAt(path, { useConstructor: false });
};

BFSStream.prototype.next = function () {
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

BFSStream.prototype.eof = function () {
    return this.q.empty();
};


export default BFSStream;