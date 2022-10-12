import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
import { ProxyFetch } from './proxy-fetch';
var AppContextService = /** @class */ (function (_super) {
    __extends(AppContextService, _super);
    function AppContextService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceCache = new Map();
        _this.proxyFetch = _this.createProxyFetch();
        return _this;
    }
    AppContextService.prototype.createProxyFetch = function () {
        return new ProxyFetch(fetch.bind(window), this.getResourceCache('fetch-cache', true));
    };
    AppContextService.prototype.getResourceCache = function (type, needRemove) {
        if (!type || this.resourceCache.has(type)) {
            return type && this.resourceCache.get(type) || [];
        }
        var resource = this.getContext().resource;
        var cacheResource = resource.filter(function (item) { return item.type === type; });
        this.resourceCache.set(type, needRemove ? [] : cacheResource);
        return cacheResource;
    };
    Object.defineProperty(AppContextService.prototype, "fetch", {
        get: function () {
            return this.proxyFetch.fetch.bind(this.proxyFetch);
        },
        enumerable: false,
        configurable: true
    });
    AppContextService = __decorate([
        Injectable()
    ], AppContextService);
    return AppContextService;
}(SharedAppContextService));
export { AppContextService };
