import { __decorate, __metadata } from "tslib";
import { Injectable, Injector } from '@fm/di';
import { map, shareReplay } from 'rxjs/operators';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
let MicroManage = class MicroManage {
    constructor(injector, la) {
        this.injector = injector;
        this.la = la;
        this.microCache = new Map();
    }
    bootstrapMicro(microName) {
        let storeSubject = this.microCache.get(microName);
        if (!storeSubject) {
            storeSubject = this.la.readMicroStatic(microName).pipe(map((result) => new MicroStore(microName, result, this)), shareReplay(1));
            this.microCache.set(microName, storeSubject);
        }
        return storeSubject;
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
