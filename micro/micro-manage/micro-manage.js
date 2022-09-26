"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const load_assets_1 = require("../load-assets/load-assets");
const micro_store_1 = require("../micro-store/micro-store");
const share_data_1 = require("../shared-data/share-data");
let MicroManage = class MicroManage {
    injector;
    la;
    loaderStyleSubject = new rxjs_1.Subject();
    chunkMap = {};
    microCache = new Map();
    constructor(injector, la) {
        this.injector = injector;
        this.la = la;
        document.querySelector = this.querySelectorProxy();
    }
    bootstrapMicro(microName) {
        let storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe((0, operators_1.tap)(({ links }) => Object.assign(this.chunkMap, { [microName]: links })), (0, operators_1.map)((result) => new micro_store_1.MicroStore(microName, result, this)), (0, operators_1.shareReplay)(1));
            this.microCache.set(microName, storeSubject);
        }
        return storeSubject;
    }
    querySelectorProxy() {
        const loaderStyleHead = document.createElement('head');
        const head = document.head;
        const _querySelector = document.querySelector.bind(document);
        Object.defineProperty(head, 'appendChild', { value: this.proxyAppendLink.bind(this, head.appendChild.bind(head)) });
        Object.defineProperty(loaderStyleHead, 'appendChild', { value: this.loaderStyleSubject.next.bind(this.loaderStyleSubject) });
        return (selectors) => /^styleLoaderInsert:[^:]+::shadow$/g.test(selectors) ? loaderStyleHead : _querySelector(selectors);
    }
    proxyAppendLink(appendChild, linkNode) {
        if (linkNode.nodeName === 'LINK') {
            const href = linkNode.getAttribute('href') || '';
            const microName = Object.keys(this.chunkMap).find((name) => this.chunkMap[name].includes(href));
            microName && (linkNode.href = URL.createObjectURL(new Blob([''])));
        }
        return appendChild(linkNode);
    }
    get sharedData() {
        return this.injector.get(share_data_1.SharedData);
    }
};
MicroManage = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [di_1.Injector, load_assets_1.LoadAssets])
], MicroManage);
exports.MicroManage = MicroManage;
