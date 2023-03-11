import { __assign, __decorate, __metadata, __param, __rest } from "tslib";
import { Inject, Injectable } from '@fm/di';
import { createMicroElementTemplate, HttpFetchHandler, MICRO_OPTIONS, serializableAssets } from '@fm/shared';
import { isEmpty, merge } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { microOptions } from '../micro-options';
var LoadAssets = /** @class */ (function () {
    function LoadAssets(http, options) {
        if (options === void 0) { options = {}; }
        this.http = http;
        this.options = options;
        this.cacheServerData = this.initialCacheServerData();
        this.options = merge(microOptions, this.options);
    }
    LoadAssets.prototype.initialCacheServerData = function () {
        return typeof microFetchData !== 'undefined' ? microFetchData : [];
    };
    LoadAssets.prototype.parseStatic = function (microName, entrypoints) {
        var microData = this.cacheServerData.find(function (_a) {
            var _microName = _a.microName;
            return microName === _microName;
        });
        var fetchCacheData = JSON.parse(microData && microData.source || '[]');
        var staticAssets = __assign(__assign({}, serializableAssets(entrypoints)), { script: [], fetchCacheData: fetchCacheData });
        return this.readJavascript(staticAssets);
    };
    LoadAssets.prototype.reeadLinkToStyles = function (links) {
        var _this = this;
        return isEmpty(links) ? of(links) : forkJoin(links.map(function (href) { return _this.fetchStatic(href); }));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LoadAssets.prototype.readJavascript = function (_a) {
        var _this = this;
        var js = _a.js, script = _a.script, other = __rest(_a, ["js", "script"]);
        return forkJoin(js.map(function (src) { return _this.fetchStatic(src); })).pipe(map(function (script) { return (__assign({ script: script, js: js }, other)); }));
    };
    LoadAssets.prototype.createMicroTag = function (microName, staticAssets) {
        var tag = document.createElement("".concat(microName, "-tag"));
        return tag && tag.shadowRoot ? of(staticAssets) : this.reeadLinkToStyles(staticAssets.links).pipe(
        // eslint-disable-next-line no-new-func
        tap(function (linkToStyles) { return new Function(createMicroElementTemplate(microName, { linkToStyles: linkToStyles }))(); }), map(function () { return staticAssets; }));
    };
    LoadAssets.prototype.fetchStatic = function (url, isText) {
        if (isText === void 0) { isText = true; }
        var _a = this.options.fetchHandler, fetchHandler = _a === void 0 ? this.http.handle.bind(this.http) : _a;
        return fetchHandler(url).pipe(mergeMap(function (res) { return isText ? res.text() : res.json(); }));
    };
    LoadAssets.prototype.readMicroStatic = function (microName) {
        var _this = this;
        var assetsPath = this.options.assetsPath;
        return this.fetchStatic(assetsPath(microName), false).pipe(switchMap(function (result) { return _this.parseStatic(microName, result); }), switchMap(function (result) { return _this.createMicroTag(microName, result); }));
    };
    LoadAssets = __decorate([
        Injectable(),
        __param(1, Inject(MICRO_OPTIONS)),
        __metadata("design:paramtypes", [HttpFetchHandler, Object])
    ], LoadAssets);
    return LoadAssets;
}());
export { LoadAssets };
