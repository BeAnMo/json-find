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

export default Queue;