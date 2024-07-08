import { __decorate } from "tslib";
import { Injectable } from '@hwy-fm/di';
let SharedData = class SharedData {
    constructor() {
        this.data = new Map();
    }
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
    delete(key) {
        this.data.delete(key);
    }
};
SharedData = __decorate([
    Injectable()
], SharedData);
export { SharedData };
