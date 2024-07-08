"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var http_1 = require("@hwy-fm/core/common/http");
var app_context_1 = require("@hwy-fm/core/providers/app-context");
var json_config_1 = require("@hwy-fm/core/providers/json-config");
var token_1 = require("@hwy-fm/core/token");
var di_1 = require("@hwy-fm/di");
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
    Platform.prototype.bootstrapRender = function (providers) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var injector;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(token_2.IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.bootstrapMicroRender = function (providers, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var microManage, head, body, _options, microConfig, injector, unRender;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        microManage = options.microManage, head = options.head, body = options.body, _options = tslib_1.__rest(options, ["microManage", "head", "body"]);
                        microConfig = { container: body, styleContainer: head, useMicroManage: function () { return microManage; } };
                        injector = this.beforeBootstrapRender(microConfig, providers);
                        return [4 /*yield*/, this.runRender(injector, _options)];
                    case 1:
                        unRender = _a.sent();
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
    Platform.prototype.runRender = function (injector, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var application;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, injector.get(token_1.APPLICATION_TOKEN)];
                    case 1:
                        application = _b.sent();
                        return [2 /*return*/, (_a = application.main) === null || _a === void 0 ? void 0 : _a.call(application, injector, options)];
                }
            });
        });
    };
    return Platform;
}());
exports.Platform = Platform;
