import { __decorate, __extends, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { HttpClient } from '@fm/shared';
import { JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { cloneDeep } from 'lodash';
import { map, of, shareReplay } from 'rxjs';
import { AppContextService } from '../app-context';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService(injector, http) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.http = http;
        _this.appContext = _this.injector.get(AppContextService);
        _this.cacheConfig = _this.resetCacheConfig();
        return _this;
    }
    JsonConfigService.prototype.createCache = function (observable) {
        return observable.pipe(shareReplay(1), map(cloneDeep));
    };
    JsonConfigService.prototype.resetCacheConfig = function () {
        var _this = this;
        var staticList = this.appContext.getResourceCache('file-static');
        var entries = staticList.map(function (_a) {
            var url = _a.url, source = _a.source;
            return [url, _this.createCache(of(source))];
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
    JsonConfigService = __decorate([
        Injectable(),
        __param(0, Inject(Injector)),
        __metadata("design:paramtypes", [Injector, HttpClient])
    ], JsonConfigService);
    return JsonConfigService;
}(SharedJsonConfigService));
export { JsonConfigService };
