"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var operators_1 = require("rxjs/operators");
var load_assets_1 = require("../load-assets/load-assets");
var micro_store_1 = require("../micro-store/micro-store");
var share_data_1 = require("../shared-data/share-data");
var MicroManage = /** @class */ (function () {
    function MicroManage(injector, la) {
        this.injector = injector;
        this.la = la;
        this.microCache = new Map();
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe((0, operators_1.map)(function (result) { return new micro_store_1.MicroStore(microName, result, _this); }), (0, operators_1.shareReplay)(1));
            this.microCache.set(microName, storeSubject);
        }
        return storeSubject;
    };
    Object.defineProperty(MicroManage.prototype, "sharedData", {
        get: function () {
            return this.injector.get(share_data_1.SharedData);
        },
        enumerable: false,
        configurable: true
    });
    MicroManage = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, load_assets_1.LoadAssets])
    ], MicroManage);
    return MicroManage;
}());
exports.MicroManage = MicroManage;
