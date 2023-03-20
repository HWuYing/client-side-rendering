import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/core';
let AppContextService = class AppContextService extends SharedAppContextService {
    constructor() {
        super(...arguments);
        this.resourceCache = new Map();
    }
    getResourceCache(type, needRemove = true) {
        if (this.resourceCache.has(type)) {
            return type && this.resourceCache.get(type) || [];
        }
        const resource = this.getContext().resource;
        const cacheResource = resource.filter((item) => item.type === type);
        this.resourceCache.set(type, needRemove ? [] : cacheResource);
        return cacheResource;
    }
    get fetch() {
        return fetch;
    }
};
AppContextService = __decorate([
    Injectable()
], AppContextService);
export { AppContextService };
