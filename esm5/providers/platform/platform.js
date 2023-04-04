import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { APP_CONTEXT, AppContextService, HISTORY, HTTP_INTERCEPTORS, HttpHandler, HttpInterceptingHandler, JsonConfigService } from '@fm/core';
import { APPLICATION_TOKEN } from '@fm/core/providers/platform';
import { Injector } from '@fm/di';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService, JsonIntercept } from '../json-config';
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
                        return [4 /*yield*/, this.importMicro(providers)];
                    case 1:
                        _b.sent();
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined, _render)];
                    case 2:
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
        this.regeditHistory(providers);
        return Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.importMicro = function (providers) {
        return __awaiter(this, void 0, void 0, function () {
            var importMicro, MicroManage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importMicro = this.platformInjector.get(IMPORT_MICRO);
                        if (!importMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        MicroManage = (_a.sent()).MicroManage;
                        providers.push({ provide: IMPORT_MICRO, useExisting: MicroManage });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.regeditHistory = function (providers) {
        var _this = this;
        var historyProvider = providers.find(function (_a) {
            var provide = _a.provide;
            return provide === HISTORY;
        });
        if (historyProvider || this.platformInjector.get(HISTORY)) {
            var deps = [Injector];
            var factory = function (injector, history) {
                var historyKey = HISTORY.toString();
                var _a = injector.get(AppContextService).microManage, _b = _a === void 0 ? {} : _a, _c = _b.sharedData, sharedData = _c === void 0 ? void (0) : _c;
                var sharedHistory = (sharedData === null || sharedData === void 0 ? void 0 : sharedData.get(historyKey)) || history || _this.platformInjector.get(HISTORY);
                sharedData === null || sharedData === void 0 ? void 0 : sharedData.set(historyKey, sharedHistory);
                return sharedHistory;
            };
            if (historyProvider) {
                providers.push(__assign(__assign({}, historyProvider), { provide: historyProvider }));
                deps.push(historyProvider);
            }
            providers.push({ provide: HISTORY, useFactory: factory, deps: deps });
        }
    };
    Platform.prototype.runRender = function (injector, options, render) {
        var application = injector.get(APPLICATION_TOKEN);
        return (render || application.bootstrapRender).call(application, injector, options);
    };
    Platform.prototype.parseParams = function (providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [__spreadArray([], providers, true), render, options];
    };
    return Platform;
}());
export { Platform };
