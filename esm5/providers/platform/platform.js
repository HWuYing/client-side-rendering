import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { getProvider, Injector, StaticInjector } from '@fm/di';
import { APP_CONTEXT, AppContextService } from '@fm/shared/providers/app-context';
import { JsonConfigService } from '@fm/shared/providers/json-config';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService } from '../json-config';
var Platform = /** @class */ (function () {
    function Platform(providers) {
        this.providers = providers;
        this.rootInjector = getProvider(Injector);
    }
    Platform.prototype.bootstrapRender = function (render) {
        if (!this.isMicro) {
            return this.importMicro(this.beforeBootstrapRender()).then(render);
        }
        microStore.render = this.proxyRender.bind(this, render);
    };
    Platform.prototype.proxyRender = function (render, options) {
        return __awaiter(this, void 0, void 0, function () {
            var microManage, head, body, _options, microConfig, injector, unRender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        microManage = options.microManage, head = options.head, body = options.body, _options = __rest(options, ["microManage", "head", "body"]);
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
        var injector = new StaticInjector(this.rootInjector, { isScope: 'self' });
        var container = document.getElementById('app');
        var styleContainer = document.head;
        var appContext = __assign({ fetch: fetch, container: container, styleContainer: styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro }, context);
        var _providers = __spreadArray(__spreadArray(__spreadArray([], this.providers, true), [
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: JsonConfigService, useClass: ClientJsonConfigService },
            { provide: AppContextService, useClass: ClientAppContextService }
        ], false), providers, true);
        _providers.forEach(function (provider) { return injector.set(provider.provide, provider); });
        return injector;
    };
    Platform.prototype.importMicro = function (injector) {
        return __awaiter(this, void 0, void 0, function () {
            var importMicro, _a, registryMicro, MicroManage_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        importMicro = injector.get(IMPORT_MICRO);
                        if (!importMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        _a = _b.sent(), registryMicro = _a.registryMicro, MicroManage_1 = _a.MicroManage;
                        registryMicro(this.rootInjector);
                        injector.get(APP_CONTEXT).useMicroManage = function () { return injector.get(MicroManage_1); };
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
export { Platform };
