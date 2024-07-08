import { __decorate } from "tslib";
import { AppContextService as SharedAppContextService } from '@hwy-fm/core/providers';
import { Injectable } from '@hwy-fm/di';
let AppContextService = class AppContextService extends SharedAppContextService {
    constructor() {
        super(...arguments);
        this.resourceCache = new Map();
    }
    getResourceCache(type, needRemove = true) {
        if (!type || this.resourceCache.has(type)) {
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
