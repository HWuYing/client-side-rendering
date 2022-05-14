import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
let SharedData = class SharedData {
    data = new Map();
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
};
SharedData = __decorate([
    Injectable()
], SharedData);
export { SharedData };
