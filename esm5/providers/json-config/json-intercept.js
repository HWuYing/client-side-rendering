import { __decorate, __metadata, __param } from "tslib";
import { AppContextService as SharedContext, createResponse } from '@fm/core';
import { Inject, Injectable, Injector } from '@fm/di';
import { cloneDeep } from 'lodash';
import { from, map, of, shareReplay, switchMap, tap } from 'rxjs';
var FILE_STATIC = 'file-static';
export var JSON_TYPE = 'json-config';
var JsonIntercept = /** @class */ (function () {
    function JsonIntercept(injector) {
        this.injector = injector;
        this.appContext = this.injector.get(SharedContext);
        this.cacheConfig = this.resetCacheConfig();
    }
    JsonIntercept.prototype.createCache = function (observable) {
        return observable.pipe(shareReplay(1), map(cloneDeep));
    };
    JsonIntercept.prototype.resetCacheConfig = function () {
        var _this = this;
        var staticList = this.appContext.getResourceCache(FILE_STATIC, false);
        var entries = staticList.map(function (_a) {
            var url = _a.url, source = _a.source;
            return [url, _this.createCache(of(source))];
        });
        return new Map(entries);
    };
    JsonIntercept.prototype.putGlobalSource = function (url, json) {
        var _a = this.appContext.getContext().resource, resource = _a === void 0 ? [] : _a;
        if (!resource.some(function (item) { return item.url === url; })) {
            resource.push({ type: FILE_STATIC, url: url, source: json });
        }
        this.cacheConfig.set(url, this.createCache(of(json)));
    };
    JsonIntercept.prototype.intercept = function (req, params, next) {
        var _this = this;
        var _a = params.requestType, requestType = _a === void 0 ? '' : _a;
        var isJsonFetch = requestType === JSON_TYPE;
        if (isJsonFetch && this.cacheConfig.has(req)) {
            var respons = createResponse();
            respons.json = function () { return _this.cacheConfig.get(req); };
            return of(respons);
        }
        var event$ = next.handle(req, params);
        return !isJsonFetch ? event$ : event$.pipe(switchMap(function (response) {
            return from(response.clone().json()).pipe(tap(function (json) { return _this.putGlobalSource(req, json); }), map(function () { return response; }));
        }));
    };
    JsonIntercept = __decorate([
        Injectable(),
        __param(0, Inject(Injector)),
        __metadata("design:paramtypes", [Injector])
    ], JsonIntercept);
    return JsonIntercept;
}());
export { JsonIntercept };
