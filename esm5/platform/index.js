import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { HttpHandler, HttpInterceptingHandler } from '@fm/core/common/http';
import { APP_CONTEXT, AppContextService } from '@fm/core/providers/app-context';
import { JsonConfigService } from '@fm/core/providers/json-config';
import { APPLICATION_TOKEN, HTTP_INTERCEPTORS } from '@fm/core/token';
import { Injector } from '@fm/di';
import { AppContextService as ClientAppContextService } from '../providers/app-context';
import { JsonConfigService as ClientJsonConfigService, JsonIntercept } from '../providers/json-config';
import { IMPORT_MICRO } from '../token';
var Platform = /** @class */ (function () {
    function Platform(platformInjector, _a) {
        var isMicro = _a.isMicro, resource = _a.resource;
        this.platformInjector = platformInjector;
        this.resource = resource;
        this.isMicro = isMicro;
    }
    Platform.prototype.bootstrapRender = function (additionalProviders, render) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, injector;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render), providers = _a[0], _render = _a[1];
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined, _render)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.bootstrapMicroRender = function (additionalProviders, render, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, __options, microManage, head, body, _options, microConfig, injector, unRender;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render, options), providers = _a[0], _render = _a[1], __options = _a[2];
                        microManage = __options.microManage, head = __options.head, body = __options.body, _options = __rest(__options, ["microManage", "head", "body"]);
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
        var appContext = __assign({ container: container, styleContainer: styleContainer, renderSSR: renderSSR, resource: this.resource, isMicro: this.isMicro }, context);
        var additionalProviders = [
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ClientJsonConfigService },
            { provide: AppContextService, useExisting: ClientAppContextService },
            { provide: HTTP_INTERCEPTORS, multi: true, useExisting: JsonIntercept },
            providers,
        ];
        return Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.runRender = function (injector, options, render) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var application;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, injector.get(APPLICATION_TOKEN)];
                    case 1:
                        application = _b.sent();
                        return [2 /*return*/, (_a = (render || application.main)) === null || _a === void 0 ? void 0 : _a.call(application, injector, options)];
                }
            });
        });
    };
    Platform.prototype.parseParams = function (providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [__spreadArray([], providers, true), render, options];
    };
    return Platform;
}());
export { Platform };
