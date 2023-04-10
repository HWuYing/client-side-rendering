import { __awaiter, __rest } from "tslib";
import { APP_CONTEXT, AppContextService, HISTORY, HTTP_INTERCEPTORS, HttpHandler, HttpInterceptingHandler, JsonConfigService } from '@fm/core';
import { APPLICATION_TOKEN } from '@fm/core/providers/platform';
import { Injector } from '@fm/di';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService, JsonIntercept } from '../json-config';
export class Platform {
    constructor(platformInjector, { isMicro, resource }) {
        this.platformInjector = platformInjector;
        this.resource = resource;
        this.isMicro = isMicro;
    }
    bootstrapRender(additionalProviders, render) {
        return __awaiter(this, void 0, void 0, function* () {
            const [providers, _render] = this.parseParams(additionalProviders, render);
            yield this.importMicro(providers);
            const injector = this.beforeBootstrapRender({ useMicroManage: () => injector.get(IMPORT_MICRO) }, providers);
            yield this.runRender(injector, undefined, _render);
        });
    }
    bootstrapMicroRender(additionalProviders, render, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [providers, _render, __options] = this.parseParams(additionalProviders, render, options);
            const { microManage, head, body } = __options, _options = __rest(__options, ["microManage", "head", "body"]);
            const microConfig = { container: body, styleContainer: head, useMicroManage: () => microManage };
            const injector = this.beforeBootstrapRender(microConfig, providers);
            const unRender = yield this.runRender(injector, _options, _render);
            return (_container) => {
                unRender(_container);
                injector.destroy();
                this.platformInjector.destroy();
            };
        });
    }
    beforeBootstrapRender(context = {}, providers = []) {
        const container = context.container || document.getElementById('app');
        const styleContainer = document.head;
        const renderSSR = !!(container === null || container === void 0 ? void 0 : container.innerHTML);
        const appContext = Object.assign({ container, styleContainer, renderSSR, resource: this.resource, isMicro: this.isMicro }, context);
        const additionalProviders = [
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ClientJsonConfigService },
            { provide: AppContextService, useExisting: ClientAppContextService },
            { provide: HTTP_INTERCEPTORS, multi: true, useExisting: JsonIntercept },
            providers,
        ];
        this.registerHistory(providers);
        return Injector.create(additionalProviders, this.platformInjector);
    }
    importMicro(providers) {
        return __awaiter(this, void 0, void 0, function* () {
            const importMicro = this.platformInjector.get(IMPORT_MICRO);
            if (importMicro) {
                const { MicroManage } = yield importMicro;
                providers.push({ provide: IMPORT_MICRO, useExisting: MicroManage });
            }
        });
    }
    registerHistory(providers) {
        const historyProvider = providers.find(({ provide }) => provide === HISTORY);
        if (historyProvider || this.platformInjector.get(HISTORY)) {
            const deps = [Injector];
            const factory = (injector, history) => {
                const historyKey = HISTORY.toString();
                const { microManage: { sharedData = void (0) } = {} } = injector.get(AppContextService);
                const sharedHistory = (sharedData === null || sharedData === void 0 ? void 0 : sharedData.get(historyKey)) || history || this.platformInjector.get(HISTORY);
                sharedData === null || sharedData === void 0 ? void 0 : sharedData.set(historyKey, sharedHistory);
                return sharedHistory;
            };
            if (historyProvider) {
                providers.push(Object.assign(Object.assign({}, historyProvider), { provide: historyProvider }));
                deps.push(historyProvider);
            }
            providers.push({ provide: HISTORY, useFactory: factory, deps: deps });
        }
    }
    runRender(injector, options, render) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield injector.get(APPLICATION_TOKEN);
            return (render || application.bootstrapRender).call(application, injector, options);
        });
    }
    parseParams(providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [[...providers], render, options];
    }
}
