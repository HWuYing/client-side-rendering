"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@fm/core");
var platform_1 = require("@fm/core/providers/platform");
var di_1 = require("@fm/di");
var token_1 = require("../../token");
var app_context_1 = require("../app-context");
var json_config_1 = require("../json-config");
var Platform = /** @class */ (function () {
    function Platform(platformInjector, _a) {
        var isMicro = _a.isMicro, resource = _a.resource;
        this.platformInjector = platformInjector;
        this.resource = resource;
        this.isMicro = isMicro;
    }
    Platform.prototype.bootstrapRender = function (additionalProviders, render) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, injector;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render), providers = _a[0], _render = _a[1];
                        return [4 /*yield*/, this.importMicro(providers)];
                    case 1:
                        _b.sent();
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(token_1.IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined, _render)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.bootstrapMicroRender = function (additionalProviders, render, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, __options, microManage, head, body, _options, microConfig, injector, unRender;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render, options), providers = _a[0], _render = _a[1], __options = _a[2];
                        microManage = __options.microManage, head = __options.head, body = __options.body, _options = tslib_1.__rest(__options, ["microManage", "head", "body"]);
                        microConfig = { container: body, styleContainer: head, useMicroManage: function () { return microManage; } };
                        injector = this.beforeBootstrapRender(microConfig, providers);
                        return [4 /*yield*/, this.runRender(injector, _options, _render)];
                    case 1:
                        unRender = _b.sent();
                        return [2 /*return*/, function (_container) {
                                unRender(_container);
                                injector.destroy();
                                _this.platformInjector.destroy();
                            }];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (context === void 0) { context = {}; }
        if (providers === void 0) { providers = []; }
        var container = context.container || document.getElementById('app');
        var styleContainer = document.head;
        var renderSSR = !!(container === null || container === void 0 ? void 0 : container.innerHTML);
        var appContext = tslib_1.__assign({ container: container, styleContainer: styleContainer, renderSSR: renderSSR, resource: this.resource, isMicro: this.isMicro }, context);
        var additionalProviders = [
            { provide: core_1.APP_CONTEXT, useValue: appContext },
            { provide: core_1.HttpHandler, useExisting: core_1.HttpInterceptingHandler },
            { provide: core_1.JsonConfigService, useExisting: json_config_1.JsonConfigService },
            { provide: core_1.AppContextService, useExisting: app_context_1.AppContextService },
            { provide: core_1.HTTP_INTERCEPTORS, multi: true, useExisting: json_config_1.JsonIntercept },
            providers,
        ];
        this.registerHistory(providers);
        return di_1.Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.importMicro = function (providers) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var importMicro, MicroManage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importMicro = this.platformInjector.get(token_1.IMPORT_MICRO);
                        if (!importMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        MicroManage = (_a.sent()).MicroManage;
                        providers.push({ provide: token_1.IMPORT_MICRO, useExisting: MicroManage });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.registerHistory = function (providers) {
        var _this = this;
        var historyProvider = providers.find(function (_a) {
            var provide = _a.provide;
            return provide === core_1.HISTORY;
        });
        if (historyProvider || this.platformInjector.get(core_1.HISTORY)) {
            var deps = [di_1.Injector];
            var factory = function (injector, history) {
                var historyKey = core_1.HISTORY.toString();
                var _a = injector.get(core_1.AppContextService).microManage, _b = _a === void 0 ? {} : _a, _c = _b.sharedData, sharedData = _c === void 0 ? void (0) : _c;
                var sharedHistory = (sharedData === null || sharedData === void 0 ? void 0 : sharedData.get(historyKey)) || history || _this.platformInjector.get(core_1.HISTORY);
                sharedData === null || sharedData === void 0 ? void 0 : sharedData.set(historyKey, sharedHistory);
                return sharedHistory;
            };
            if (historyProvider) {
                providers.push(tslib_1.__assign(tslib_1.__assign({}, historyProvider), { provide: historyProvider }));
                deps.push(historyProvider);
            }
            providers.push({ provide: core_1.HISTORY, useFactory: factory, deps: deps });
        }
    };
    Platform.prototype.runRender = function (injector, options, render) {
        var application = injector.get(platform_1.APPLICATION_TOKEN);
        return (render || application.bootstrapRender).call(application, injector, options);
    };
    Platform.prototype.parseParams = function (providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [tslib_1.__spreadArray([], providers, true), render, options];
    };
    return Platform;
}());
exports.Platform = Platform;
