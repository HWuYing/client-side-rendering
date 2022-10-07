"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroStore = void 0;
var tslib_1 = require("tslib");
var MicroStore = /** @class */ (function () {
    function MicroStore(microName, staticAssets, microManage) {
        var _a;
        this.microName = microName;
        this.staticAssets = staticAssets;
        this.microManage = microManage;
        this.mountedList = [];
        this.loaderStyleNodes = [];
        this.execMountedList = [];
        (_a = this.microManage.loaderStyleSubject) === null || _a === void 0 ? void 0 : _a.subscribe(this.headAppendChildProxy.bind(this));
    }
    MicroStore.prototype.onMounted = function (container, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.execMountedList.push([container, options]);
                        if (!!this._renderMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadScriptContext()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.execMountedList.length === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.execMounted()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MicroStore.prototype.unMounted = function (container) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exMicroInfo, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        exMicroInfo = this.mountedList.filter(function (_a) {
                            var _container = _a.container;
                            return container === _container;
                        })[0];
                        if (!exMicroInfo) return [3 /*break*/, 3];
                        this.mountedList.splice(this.mountedList.indexOf(exMicroInfo), 1);
                        _b = exMicroInfo.unRender;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, exMicroInfo.unRender((_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="body"]'))];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _b;
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MicroStore.prototype.execMounted = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, container, options, unRender;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.execMountedList.shift(), container = _a[0], options = _a[1];
                        return [4 /*yield*/, this._renderMicro(this.parseRenderOptions(container, options))];
                    case 1:
                        unRender = _b.sent();
                        this.mountendAppendLoadStyleNode(container);
                        this.mountedList.push({ unRender: unRender, container: container });
                        if (!(this.execMountedList.length !== 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.execMounted()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MicroStore.prototype.execJavascript = function (execFunctions) {
        var fetchCacheData = this.staticAssets.fetchCacheData;
        var microStore = { render: function () { return void (0); } };
        execFunctions.forEach(function (fun) { return fun(microStore, fetchCacheData); });
        return microStore.render;
    };
    MicroStore.prototype.parseRenderOptions = function (container, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var head = (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="head"]');
        var body = (_b = container.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('[data-app="body"]');
        return tslib_1.__assign(tslib_1.__assign({}, options), { head: head, body: body, microManage: this.microManage });
    };
    MicroStore.prototype.headAppendChildProxy = function (styleNode) {
        var _this = this;
        if (styleNode.getAttribute('data-micro') === this.microName) {
            this.loaderStyleNodes.push(styleNode);
            this.mountedList.forEach(function (_a) {
                var container = _a.container;
                return _this.mountendAppendLoadStyleNode(container, [styleNode]);
            });
        }
    };
    MicroStore.prototype.mountendAppendLoadStyleNode = function (container, styleNodes) {
        var _a;
        if (styleNodes === void 0) { styleNodes = this.loaderStyleNodes; }
        var styleContainer = (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="head"]');
        if (styleContainer) {
            styleNodes.forEach(function (styleNode) { return styleContainer.appendChild(styleNode.cloneNode(true)); });
        }
    };
    MicroStore.prototype.loadScriptContext = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, script, js;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                _a = this.staticAssets, script = _a.script, js = _a.js;
                return [2 /*return*/, Promise.all(script.map(function (source, index) {
                        var hasSourceMap = !/[\S]+\.[\S]+\.js$/.test(js[index]);
                        var sourceCode = _this.formatSourceCode(source);
                        // eslint-disable-next-line no-new-func
                        return hasSourceMap ? _this.loadBlobScript(sourceCode) : Promise.resolve(new Function('microStore', 'fetchCacheData', sourceCode));
                    })).then(function (execFunctions) { return _this._renderMicro = _this.execJavascript(execFunctions); })];
            });
        });
    };
    MicroStore.prototype.loadBlobScript = function (source) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var funName = "".concat(_this.microName).concat(Math.random().toString().replace(/0.([\d]{5})\d*/ig, '$1'));
                        var script = document.createElement('script');
                        script.src = URL.createObjectURL(new Blob(["window.".concat(funName, "=function(microStore, fetchCacheData){ ").concat(source, "}")]));
                        document.body.appendChild(script);
                        script.onload = function () { return resolve(window[funName]); };
                    })];
            });
        });
    };
    MicroStore.prototype.formatSourceCode = function (source) {
        return "".concat(source, "\n");
    };
    return MicroStore;
}());
exports.MicroStore = MicroStore;
