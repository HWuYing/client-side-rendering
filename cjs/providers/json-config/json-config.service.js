"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var http_1 = require("@fm/shared/common/http");
var json_config_1 = require("@fm/shared/providers/json-config");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var app_context_1 = require("../app-context");
var JsonConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(JsonConfigService, _super);
    function JsonConfigService(injector, http) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.http = http;
        _this.appContext = _this.injector.get(app_context_1.AppContextService);
        _this.cacheConfig = _this.resetCacheConfig();
        return _this;
    }
    JsonConfigService.prototype.createCache = function (observable) {
        return observable.pipe((0, rxjs_1.shareReplay)(1), (0, rxjs_1.map)(lodash_1.cloneDeep));
    };
    JsonConfigService.prototype.resetCacheConfig = function () {
        var _this = this;
        var staticList = this.appContext.getResourceCache('file-static');
        var entries = staticList.map(function (_a) {
            var url = _a.url, source = _a.source;
            return [url, _this.createCache((0, rxjs_1.of)(source))];
        });
        return new Map(entries);
    };
    JsonConfigService.prototype.getServerFetchData = function (url) {
        var _a = (this.appContext.getEnvironment() || {}).publicPath, publicPath = _a === void 0 ? '/' : _a;
        return this.http.get(/http|https/.test(url) ? url : "".concat(publicPath, "/").concat(url).replace(/\/+/g, '/'));
    };
    JsonConfigService.prototype.getJsonConfig = function (url) {
        var subject = this.cacheConfig.get(url);
        if (!subject) {
            subject = this.createCache(this.getServerFetchData(url));
            this.cacheConfig.set(url, subject);
        }
        return subject;
    };
    JsonConfigService = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, http_1.HttpClient])
    ], JsonConfigService);
    return JsonConfigService;
}(json_config_1.JsonConfigService));
exports.JsonConfigService = JsonConfigService;
