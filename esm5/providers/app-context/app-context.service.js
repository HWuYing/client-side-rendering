import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/core';
var AppContextService = /** @class */ (function (_super) {
    __extends(AppContextService, _super);
    function AppContextService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceCache = new Map();
        return _this;
    }
    AppContextService.prototype.getResourceCache = function (type, needRemove) {
        if (needRemove === void 0) { needRemove = true; }
        if (this.resourceCache.has(type)) {
            return type && this.resourceCache.get(type) || [];
        }
        var resource = this.getContext().resource;
        var cacheResource = resource.filter(function (item) { return item.type === type; });
        this.resourceCache.set(type, needRemove ? [] : cacheResource);
        return cacheResource;
    };
    Object.defineProperty(AppContextService.prototype, "fetch", {
        get: function () {
            return fetch;
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
