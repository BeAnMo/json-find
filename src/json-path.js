import { isArray } from './utils';

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

JsonPath.prototype.setDelimeter = function (newDelim) {
    this.delimiter = newDelim;

    return this;
};


export default JsonPath;