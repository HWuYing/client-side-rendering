"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var app_context_1 = require("@fm/shared/providers/app-context");
var json_config_1 = require("@fm/shared/providers/json-config");
var token_1 = require("../../token");
var app_context_2 = require("../app-context");
var json_config_2 = require("../json-config");
var Platform = /** @class */ (function () {
    function Platform(providers) {
        this.providers = providers;
        this.rootInjector = (0, di_1.getProvider)(di_1.Injector);
    }
    Platform.prototype.bootstrapRender = function (render) {
        if (!this.isMicro) {
            return this.importMicro(this.beforeBootstrapRender()).then(render);
        }
        microStore.render = this.proxyRender.bind(this, render);
    };
    Platform.prototype.proxyRender = function (render, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var microManage, head, body, _options, microConfig, injector, unRender;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        microManage = options.microManage, head = options.head, body = options.body, _options = tslib_1.__rest(options, ["microManage", "head", "body"]);
                        microConfig = { container: body, styleContainer: head, useMicroManage: function () { return microManage; } };
                        injector = this.beforeBootstrapRender(microConfig);
                        return [4 /*yield*/, render(injector, _options)];
                    case 1:
                        unRender = _a.sent();
                        return [2 /*return*/, function (_container) { unRender(_container); injector.clear(); }];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (context === void 0) { context = {}; }
        if (providers === void 0) { providers = []; }
        var injector = new di_1.StaticInjector(this.rootInjector, { isScope: 'self' });
        var container = document.getElementById('app');
        var styleContainer = document.head;
        var appContext = tslib_1.__assign({ fetch: fetch, container: container, styleContainer: styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro }, context);
        var _providers = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], this.providers, true), [
            { provide: app_context_1.APP_CONTEXT, useValue: appContext },
            { provide: json_config_1.JsonConfigService, useClass: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useClass: app_context_2.AppContextService }
        ], false), providers, true);
        _providers.forEach(function (provider) { return injector.set(provider.provide, provider); });
        return injector;
    };
    Platform.prototype.importMicro = function (injector) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var importMicro, _a, registryMicro, MicroManage_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        importMicro = injector.get(token_1.IMPORT_MICRO);
                        if (!importMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        _a = _b.sent(), registryMicro = _a.registryMicro, MicroManage_1 = _a.MicroManage;
                        registryMicro(this.rootInjector);
                        injector.get(app_context_1.APP_CONTEXT).useMicroManage = function () { return injector.get(MicroManage_1); };
                        _b.label = 2;
                    case 2: return [2 /*return*/, injector];
                }
            });
        });
    };
    Object.defineProperty(Platform.prototype, "isMicro", {
        get: function () {
            return typeof microStore !== 'undefined';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Platform.prototype, "resource", {
        get: function () {
            return typeof fetchCacheData !== 'undefined' ? fetchCacheData : {};
        },
        enumerable: false,
        configurable: true
    });
    return Platform;
}());
exports.Platform = Platform;
