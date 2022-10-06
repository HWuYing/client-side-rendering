"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var load_assets_1 = require("../load-assets/load-assets");
var micro_store_1 = require("../micro-store/micro-store");
var share_data_1 = require("../shared-data/share-data");
var MicroManage = /** @class */ (function () {
    function MicroManage(injector, la) {
        this.injector = injector;
        this.la = la;
        this.loaderStyleSubject = new rxjs_1.Subject();
        this.chunkMap = {};
        this.microCache = new Map();
        document.querySelector = this.querySelectorProxy();
    }
    MicroManage.prototype.bootstrapMicro = function (microName) {
        var _this = this;
        var storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe((0, operators_1.tap)(function (_a) {
                var _b;
                var links = _a.links;
                return Object.assign(_this.chunkMap, (_b = {}, _b[microName] = links, _b));
            }), (0, operators_1.map)(function (result) { return new micro_store_1.MicroStore(microName, result, _this); }), (0, operators_1.shareReplay)(1));
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
