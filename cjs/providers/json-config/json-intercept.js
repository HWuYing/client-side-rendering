"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonIntercept = exports.JSON_TYPE = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var shared_1 = require("@fm/shared");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var FILE_STATIC = 'file-static';
exports.JSON_TYPE = 'json-config';
var JsonIntercept = /** @class */ (function () {
    function JsonIntercept(injector) {
        this.injector = injector;
        this.appContext = this.injector.get(shared_1.AppContextService);
        this.cacheConfig = this.resetCacheConfig();
    }
    JsonIntercept.prototype.createCache = function (observable) {
        return observable.pipe((0, rxjs_1.shareReplay)(1), (0, rxjs_1.map)(lodash_1.cloneDeep));
    };
    JsonIntercept.prototype.resetCacheConfig = function () {
        var _this = this;
        var staticList = this.appContext.getResourceCache(FILE_STATIC);
        var entries = staticList.map(function (_a) {
            var url = _a.url, source = _a.source;
            return [url, _this.createCache((0, rxjs_1.of)(source))];
        });
        return new Map(entries);
    };
    JsonIntercept.prototype.putGlobalSource = function (url, json) {
        var _a = this.appContext.getContext().resource, resource = _a === void 0 ? [] : _a;
        if (!resource.some(function (item) { return item.url === url; })) {
            resource.push({ type: FILE_STATIC, url: url, source: json });
        }
        this.cacheConfig.set(url, this.createCache((0, rxjs_1.of)(json)));
    };
    JsonIntercept.prototype.intercept = function (req, params, next) {
        var _this = this;
        var _a = (this.appContext.getEnvironment() || {}).publicPath, publicPath = _a === void 0 ? '/' : _a;
        var key = req.replace(publicPath, '');
        var _b = params.requestType, requestType = _b === void 0 ? '' : _b;
        var isJsonFetch = requestType === exports.JSON_TYPE;
        if (isJsonFetch && this.cacheConfig.has(key)) {
            var respons = (0, shared_1.createResponse)();
            respons.json = function () { return _this.cacheConfig.get(key); };
            return (0, rxjs_1.of)(respons);
        }
        var event$ = next.handle(req, params);
        return !isJsonFetch ? event$ : event$.pipe((0, rxjs_1.mergeMap)(function (response) { return (0, rxjs_1.from)(response.clone().json()).pipe((0, rxjs_1.tap)(function (json) { return _this.putGlobalSource(key, json); }), (0, rxjs_1.map)(function () { return response; })); }));
    };
    JsonIntercept = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector])
    ], JsonIntercept);
    return JsonIntercept;
}());
exports.JsonIntercept = JsonIntercept;
