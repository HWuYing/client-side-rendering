"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedData = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
let SharedData = class SharedData {
    data = new Map();
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
};
SharedData = tslib_1.__decorate([
    (0, di_1.Injectable)()
], SharedData);
exports.SharedData = SharedData;
