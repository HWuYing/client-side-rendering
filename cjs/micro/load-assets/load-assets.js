"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadAssets = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var shared_1 = require("@fm/shared");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var micro_options_1 = require("../micro-options");
var LoadAssets = /** @class */ (function () {
    function LoadAssets(http, options) {
        if (options === void 0) { options = {}; }
        this.http = http;
        this.options = options;
        this.cacheServerData = this.initialCacheServerData();
        this.options = (0, lodash_1.merge)(micro_options_1.microOptions, this.options);
    }
    LoadAssets.prototype.initialCacheServerData = function () {
        return typeof microFetchData !== 'undefined' ? microFetchData : [];
    };
    LoadAssets.prototype.parseStatic = function (microName, entrypoints) {
        var microData = this.cacheServerData.find(function (_a) {
            var _microName = _a.microName;
            return microName === _microName;
        });
        var fetchCacheData = JSON.parse(microData && microData.source || '{}');
        var staticAssets = tslib_1.__assign(tslib_1.__assign({}, (0, shared_1.serializableAssets)(entrypoints)), { script: [], fetchCacheData: fetchCacheData });
        return this.readJavascript(staticAssets);
    };
    LoadAssets.prototype.reeadLinkToStyles = function (links) {
        var _this = this;
        return (0, lodash_1.isEmpty)(links) ? (0, rxjs_1.of)(links) : (0, rxjs_1.forkJoin)(links.map(function (href) { return _this.http.getText(href); }));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LoadAssets.prototype.readJavascript = function (_a) {
        var _this = this;
        var js = _a.js, script = _a.script, other = tslib_1.__rest(_a, ["js", "script"]);
        return (0, rxjs_1.forkJoin)(js.map(function (src) { return _this.http.getText(src); })).pipe((0, operators_1.map)(function (script) { return (tslib_1.__assign({ script: script, js: js }, other)); }));
    };
    LoadAssets.prototype.createMicroTag = function (microName, staticAssets) {
        var tag = document.createElement("".concat(microName, "-tag"));
        return tag && tag.shadowRoot ? (0, rxjs_1.of)(staticAssets) : this.reeadLinkToStyles(staticAssets.links).pipe(
        // eslint-disable-next-line no-new-func
        (0, operators_1.tap)(function (linkToStyles) { return new Function((0, shared_1.createMicroElementTemplate)(microName, { linkToStyles: linkToStyles }))(); }), (0, operators_1.map)(function () { return staticAssets; }));
    };
    LoadAssets.prototype.readMicroStatic = function (microName) {
        var _this = this;
        var assetsPath = this.options.assetsPath;
        return this.http.get(assetsPath(microName)).pipe((0, operators_1.switchMap)(function (result) { return _this.parseStatic(microName, result); }), (0, operators_1.switchMap)(function (result) { return _this.createMicroTag(microName, result); }));
    };
    LoadAssets = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__param(1, (0, di_1.Inject)(shared_1.MICRO_OPTIONS)),
        tslib_1.__metadata("design:paramtypes", [shared_1.HttpClient, Object])
    ], LoadAssets);
    return LoadAssets;
}());
exports.LoadAssets = LoadAssets;
