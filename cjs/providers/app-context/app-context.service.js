"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
var tslib_1 = require("tslib");
var providers_1 = require("@hwy-fm/core/providers");
var di_1 = require("@hwy-fm/di");
var AppContextService = /** @class */ (function (_super) {
    tslib_1.__extends(AppContextService, _super);
    function AppContextService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceCache = new Map();
        return _this;
    }
    AppContextService.prototype.getResourceCache = function (type, needRemove) {
        if (needRemove === void 0) { needRemove = true; }
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
            return fetch;
        },
        enumerable: false,
        configurable: true
    });
    AppContextService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], AppContextService);
    return AppContextService;
}(providers_1.AppContextService));
exports.AppContextService = AppContextService;
