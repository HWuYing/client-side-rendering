import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { Subject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
var MicroManage = /** @class */ (function () {
    function MicroManage(injector, la) {
        this.injector = injector;
        this.la = la;
        this.loaderStyleSubject = new Subject();
        this.chunkMap = {};
        this.microCache = new Map();
        document.querySelector = this.querySelectorProxy();
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe(tap(function (_a) {
                var _b;
                var links = _a.links;
                return Object.assign(_this.chunkMap, (_b = {}, _b[microName] = links, _b));
            }), map(function (result) { return new MicroStore(microName, result, _this); }), shareReplay(1));
            this.microCache.set(microName, storeSubject);
        }
        return storeSubject;
    };
    MicroManage.prototype.querySelectorProxy = function () {
        var loaderStyleHead = document.createElement('head');
        var head = document.head;
        var _querySelector = document.querySelector.bind(document);
        Object.defineProperty(head, 'appendChild', { value: this.proxyAppendLink.bind(this, head.appendChild.bind(head)) });
        Object.defineProperty(loaderStyleHead, 'appendChild', { value: this.loaderStyleSubject.next.bind(this.loaderStyleSubject) });
        return function (selectors) { return /^styleLoaderInsert:[^:]+::shadow$/g.test(selectors) ? loaderStyleHead : _querySelector(selectors); };
    };
    MicroManage.prototype.proxyAppendLink = function (appendChild, linkNode) {
        var _this = this;
        if (linkNode.nodeName === 'LINK') {
            var href_1 = linkNode.getAttribute('href') || '';
            var microName = Object.keys(this.chunkMap).find(function (name) { return _this.chunkMap[name].includes(href_1); });
            microName && (linkNode.href = URL.createObjectURL(new Blob([''])));
        }
        return appendChild(linkNode);
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
