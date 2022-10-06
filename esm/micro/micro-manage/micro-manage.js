import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { Subject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
let MicroManage = class MicroManage {
    constructor(injector, la) {
        this.injector = injector;
        this.la = la;
        this.loaderStyleSubject = new Subject();
        this.chunkMap = {};
        this.microCache = new Map();
        document.querySelector = this.querySelectorProxy();
    }
    bootstrapMicro(microName) {
        let storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe(tap(({ links }) => Object.assign(this.chunkMap, { [microName]: links })), map((result) => new MicroStore(microName, result, this)), shareReplay(1));
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
        return this.injector.get(SharedData);
    }
};
MicroManage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Injector, LoadAssets])
], MicroManage);
export { MicroManage };
