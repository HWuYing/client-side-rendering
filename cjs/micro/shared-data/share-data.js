"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedData = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var SharedData = /** @class */ (function () {
    function SharedData() {
        this.data = new Map();
    }
    SharedData.prototype.set = function (key, value) {
        this.data.set(key, value);
    };
    SharedData.prototype.get = function (key) {
        return this.data.get(key);
    };
    SharedData.prototype.delete = function (key) {
        this.data.delete(key);
    };
    SharedData = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], SharedData);
    return SharedData;
}());
exports.SharedData = SharedData;
