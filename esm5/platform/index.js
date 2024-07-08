import { __assign, __awaiter, __generator, __rest } from "tslib";
import { HttpHandler, HttpInterceptingHandler } from '@hwy-fm/core/common/http';
import { APP_CONTEXT, AppContextService } from '@hwy-fm/core/providers/app-context';
import { JsonConfigService } from '@hwy-fm/core/providers/json-config';
import { APPLICATION_TOKEN, HTTP_INTERCEPTORS } from '@hwy-fm/core/token';
import { Injector } from '@hwy-fm/di';
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
    Platform.prototype.bootstrapRender = function (providers) {
        return __awaiter(this, void 0, void 0, function () {
            var injector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, this.runRender(injector, undefined)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.bootstrapMicroRender = function (providers, options) {
        return __awaiter(this, void 0, void 0, function () {
            var microManage, head, body, _options, microConfig, injector, unRender;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        microManage = options.microManage, head = options.head, body = options.body, _options = __rest(options, ["microManage", "head", "body"]);
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
        var appContext = __assign({ container: container, styleContainer: styleContainer, renderSSR: renderSSR, resource: this.resource, isMicro: this.isMicro }, context);
        var additionalProviders = [
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ClientJsonConfigService },
            { provide: AppContextService, useExisting: ClientAppContextService },
            { provide: HTTP_INTERCEPTORS, multi: true, useExisting: JsonIntercept },
            providers
        ];
        return Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.runRender = function (injector, options) {
        return __awaiter(this, void 0, void 0, function () {
            var application;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, injector.get(APPLICATION_TOKEN)];
                    case 1:
                        application = _b.sent();
                        return [2 /*return*/, (_a = application.main) === null || _a === void 0 ? void 0 : _a.call(application, injector, options)];
                }
            });
        });
    };
    return Platform;
}());
export { Platform };
