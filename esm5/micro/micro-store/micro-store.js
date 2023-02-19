import { __assign, __awaiter, __generator } from "tslib";
var FAIL = 'fail';
var SUCCESS = 'success';
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var exMicroInfo, execMounted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exMicroInfo = this.mountedList.filter(function (_a) {
                            var _container = _a.container;
                            return container === _container;
                        })[0];
                        execMounted = this.execMountedList.filter(function (_a) {
                            var _container = _a[0];
                            return _container === container;
                        })[0];
                        if (execMounted) {
                            this.execMountedList.splice(this.execMountedList.indexOf(execMounted), 1);
                        }
                        if (!(exMicroInfo && exMicroInfo.unRender && exMicroInfo.unMounted !== SUCCESS)) return [3 /*break*/, 2];
                        return [4 /*yield*/, exMicroInfo.unRender(this.getByContainer(container, 'body'))];
                    case 1:
                        _a.sent();
                        this.mountedList.splice(this.mountedList.indexOf(exMicroInfo), 1);
                        exMicroInfo.unMounted = SUCCESS;
                        _a.label = 2;
                    case 2:
                        if (exMicroInfo.unMounted !== SUCCESS) {
                            exMicroInfo.unMounted = FAIL;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MicroStore.prototype.resetUnMountedFail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(this.mountedList.filter(function (item) { return item.unMounted === FAIL; }).map(function (_a) {
                        var container = _a.container;
                        return _this.unMounted(container);
                    }))];
            });
        });
    };
    MicroStore.prototype.execMounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, container, options, mountedItem, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.execMountedList.shift(), container = _a[0], options = _a[1];
                        mountedItem = { container: container };
                        this.mountedList.push(mountedItem);
                        _b = mountedItem;
                        return [4 /*yield*/, this._renderMicro(this.parseRenderOptions(container, options))];
                    case 1:
                        _b.unRender = _d.sent();
                        return [4 /*yield*/, this.resetUnMountedFail()];
                    case 2:
                        _d.sent();
                        this.mountendAppendLoadStyleNode(container);
                        _c = this.execMountedList.length !== 0;
                        if (!_c) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.execMounted()];
                    case 3:
                        _c = (_d.sent());
                        _d.label = 4;
                    case 4:
                        _c;
                        return [2 /*return*/];
                }
            });
        });
    };
    MicroStore.prototype.execJavascript = function (execFunctions) {
        var microStore = {};
        var fetchCacheData = this.staticAssets.fetchCacheData;
        execFunctions.forEach(function (fun) { return fun(microStore, fetchCacheData); });
        return microStore.render || (function () { return void (0); });
    };
    MicroStore.prototype.parseRenderOptions = function (container, options) {
        if (options === void 0) { options = {}; }
        var head = this.getByContainer(container, 'head');
        var body = this.getByContainer(container, 'body');
        return __assign(__assign({}, options), { head: head, body: body, microManage: this.microManage });
    };
    MicroStore.prototype.headAppendChildProxy = function (styleNode) {
        var _this = this;
        if (styleNode.getAttribute('data-micro') === this.microName) {
            Promise.resolve().then(function () { return _this.loaderStyleNodes.push(styleNode.cloneNode(true)); });
            this.mountedList.forEach(function (_a) {
                var container = _a.container;
                return _this.mountendAppendLoadStyleNode(container, [styleNode]);
            });
        }
    };
    MicroStore.prototype.mountendAppendLoadStyleNode = function (container, styleNodes) {
        if (styleNodes === void 0) { styleNodes = this.loaderStyleNodes; }
        var styleContainer = this.getByContainer(container, 'head');
        if (styleContainer) {
            styleNodes.forEach(function (styleNode) { return styleContainer.appendChild(styleNode); });
        }
    };
    MicroStore.prototype.loadScriptContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, script, js;
            var _this = this;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
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
    MicroStore.prototype.getByContainer = function (container, selector) {
        var _a;
        return (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[data-app=\"".concat(selector, "\"]"));
    };
    MicroStore.prototype.formatSourceCode = function (source) {
        return "".concat(source, "\n");
    };
    return MicroStore;
}());
export { MicroStore };
