import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { HttpClient } from '@fm/shared';
import { JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { cloneDeep } from 'lodash';
import { map, of, shareReplay } from 'rxjs';
import { AppContextService } from '../app-context';
let JsonConfigService = class JsonConfigService extends SharedJsonConfigService {
    constructor(injector, http) {
        super(injector);
        this.injector = injector;
        this.http = http;
        this.appContext = this.injector.get(AppContextService);
        this.cacheConfig = this.resetCacheConfig();
    }
    createCache(observable) {
        return observable.pipe(shareReplay(1), map(cloneDeep));
    }
    resetCacheConfig() {
        const staticList = this.appContext.getResourceCache('file-static');
        const entries = staticList.map(({ url, source }) => [url, this.createCache(of(source))]);
        return new Map(entries);
    }
    getServerFetchData(url) {
        const { publicPath = '/' } = this.appContext.getEnvironment() || {};
        return this.http.get(/http|https/.test(url) ? url : `${publicPath}/${url}`.replace(/\/+/g, '/'));
    }
    getJsonConfig(url) {
        let subject = this.cacheConfig.get(url);
        if (!subject) {
            subject = this.createCache(this.getServerFetchData(url));
            this.cacheConfig.set(url, subject);
        }
        return subject;
    }
};
JsonConfigService = __decorate([
    Injectable(),
    __param(0, Inject(Injector)),
    __metadata("design:paramtypes", [Injector, HttpClient])
], JsonConfigService);
export { JsonConfigService };
