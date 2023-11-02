"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var http_1 = require("@fm/core/common/http");
var app_context_1 = require("@fm/core/providers/app-context");
var json_config_1 = require("@fm/core/providers/json-config");
var token_1 = require("@fm/core/token");
var di_1 = require("@fm/di");
var app_context_2 = require("../providers/app-context");
var json_config_2 = require("../providers/json-config");
var token_2 = require("../token");
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
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(token_2.IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined, _render)];
                    case 1:
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
            { provide: app_context_1.APP_CONTEXT, useValue: appContext },
            { provide: http_1.HttpHandler, useExisting: http_1.HttpInterceptingHandler },
            { provide: json_config_1.JsonConfigService, useExisting: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useExisting: app_context_2.AppContextService },
            { provide: token_1.HTTP_INTERCEPTORS, multi: true, useExisting: json_config_2.JsonIntercept },
            providers
        ];
        return di_1.Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.runRender = function (injector, options, render) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var application;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, injector.get(token_1.APPLICATION_TOKEN)];
                    case 1:
                        application = _b.sent();
                        return [2 /*return*/, (_a = (render || application.main)) === null || _a === void 0 ? void 0 : _a.call(application, injector, options)];
                }
            });
        });
    };
    Platform.prototype.parseParams = function (providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [tslib_1.__spreadArray([], providers, true), render, options];
    };
    return Platform;
}());
exports.Platform = Platform;
