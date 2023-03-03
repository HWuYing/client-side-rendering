import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { AppContextService as SharedContext, createResponse } from '@fm/shared';
import { cloneDeep } from 'lodash';
import { from, map, mergeMap, of, shareReplay, tap } from 'rxjs';
const FILE_STATIC = 'file-static';
export const JSON_TYPE = 'json-config';
let JsonIntercept = class JsonIntercept {
    constructor(injector) {
        this.injector = injector;
        this.appContext = this.injector.get(SharedContext);
        this.cacheConfig = this.resetCacheConfig();
    }
    createCache(observable) {
        return observable.pipe(shareReplay(1), map(cloneDeep));
    }
    resetCacheConfig() {
        const staticList = this.appContext.getResourceCache(FILE_STATIC);
        const entries = staticList.map(({ url, source }) => [url, this.createCache(of(source))]);
        return new Map(entries);
    }
    putGlobalSource(url, json) {
        const { resource = [] } = this.appContext.getContext();
        if (!resource.some((item) => item.url === url)) {
            resource.push({ type: FILE_STATIC, url, source: json });
        }
        this.cacheConfig.set(url, this.createCache(of(json)));
    }
    intercept(req, params, next) {
        const { requestType = '' } = params;
        const isJsonFetch = requestType === JSON_TYPE;
        if (isJsonFetch && this.cacheConfig.has(req)) {
            const respons = createResponse();
            respons.json = () => this.cacheConfig.get(req);
            return of(respons);
        }
        const event$ = next.handle(req, params);
        return !isJsonFetch ? event$ : event$.pipe(mergeMap((response) => {
            return from(response.clone().json()).pipe(tap((json) => this.putGlobalSource(req, json)), map(() => response));
        }));
    }
};
JsonIntercept = __decorate([
    Injectable(),
    __param(0, Inject(Injector)),
    __metadata("design:paramtypes", [Injector])
], JsonIntercept);
export { JsonIntercept };
