import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
import { ProxyFetch } from './proxy-fetch';
let AppContextService = class AppContextService extends SharedAppContextService {
    constructor() {
        super(...arguments);
        this.resourceCache = new Map();
        this.proxyFetch = this.createProxyFetch();
    }
    createProxyFetch() {
        return new ProxyFetch(fetch.bind(window), this.getResourceCache('fetch-cache', true));
    }
    getResourceCache(type, needRemove) {
        if (!type || this.resourceCache.has(type)) {
            return type && this.resourceCache.get(type) || [];
        }
        const resource = this.getContext().resource;
        const cacheResource = resource.filter((item) => item.type === type);
        this.resourceCache.set(type, needRemove ? [] : cacheResource);
        return cacheResource;
    }
    get fetch() {
        return this.proxyFetch.fetch.bind(this.proxyFetch);
    }
};
AppContextService = __decorate([
    Injectable()
], AppContextService);
export { AppContextService };
