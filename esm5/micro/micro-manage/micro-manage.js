import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { map, shareReplay } from 'rxjs/operators';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
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
            storeSubject = this.la.readMicroStatic(microName).pipe(map(function (result) { return new MicroStore(microName, result, _this); }), shareReplay(1));
            this.microCache.set(microName, storeSubject);
        }
        return storeSubject;
    };
    Object.defineProperty(MicroManage.prototype, "sharedData", {
        get: function () {
            return this.injector.get(SharedData);
        },
        enumerable: false,
        configurable: true
    });
    MicroManage = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Injector, LoadAssets])
    ], MicroManage);
    return MicroManage;
}());
export { MicroManage };
