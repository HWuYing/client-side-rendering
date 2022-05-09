"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const import_rxjs_1 = require("@fm/import-rxjs");
const import_rxjs_2 = require("@fm/import-rxjs");
const load_assets_1 = require("../load-assets/load-assets");
const micro_store_1 = require("../micro-store/micro-store");
const share_data_1 = require("../shared-data/share-data");
let MicroManage = class MicroManage {
    ls;
    la;
    loaderStyleSubject = new import_rxjs_1.Subject();
    chunkMap = {};
    microCache = new Map();
    constructor(ls, la) {
        this.ls = ls;
        this.la = la;
        document.querySelector = this.querySelectorProxy();
    }
    bootstrapMicro(microName) {
        let storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe((0, import_rxjs_2.tap)(({ links }) => Object.assign(this.chunkMap, { [microName]: links })), (0, import_rxjs_2.map)((result) => new micro_store_1.MicroStore(microName, result, this)), (0, import_rxjs_2.shareReplay)(1));
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
        return this.ls.getService(share_data_1.SharedData);
    }
};
MicroManage = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [di_1.LocatorStorage, load_assets_1.LoadAssets])
], MicroManage);
exports.MicroManage = MicroManage;
