import { __awaiter, __rest } from "tslib";
import { getProvider, Injector, StaticInjector } from '@fm/di';
import { JsonConfigService, APP_CONTEXT, AppContextService } from '@fm/shared';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService } from '../json-config';
export class Platform {
    constructor(providers) {
        this.providers = providers;
        this.rootInjector = getProvider(Injector);
    }
    bootstrapRender(render) {
        if (!this.isMicro) {
            return this.importMicro(this.beforeBootstrapRender()).then(render);
        }
        microStore.render = this.proxyRender.bind(this, render);
    }
    proxyRender(render, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { microManage, head, body } = options, _options = __rest(options, ["microManage", "head", "body"]);
            const microConfig = { container: body, styleContainer: head, useMicroManage: () => microManage };
            const injector = this.beforeBootstrapRender(microConfig);
            const unRender = yield render(injector, _options);
            return (_container) => { unRender(_container); injector.clear(); };
        });
    }
    beforeBootstrapRender(context = {}, providers = []) {
        const injector = new StaticInjector(this.rootInjector, { isScope: 'self' });
        const container = document.getElementById('app');
        const styleContainer = document.head;
        const appContext = Object.assign({ container, styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro }, context);
        const _providers = [
            ...this.providers,
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: JsonConfigService, useClass: ClientJsonConfigService },
            { provide: AppContextService, useClass: ClientAppContextService },
            ...providers
        ];
        _providers.forEach((provider) => injector.set(provider.provide, provider));
        return injector;
    }
    importMicro(injector) {
        return __awaiter(this, void 0, void 0, function* () {
            const importMicro = injector.get(IMPORT_MICRO);
            if (importMicro) {
                const { registryMicro, MicroManage } = yield importMicro;
                registryMicro(this.rootInjector);
                injector.get(APP_CONTEXT).useMicroManage = () => injector.get(MicroManage);
            }
            return injector;
        });
    }
    get isMicro() {
        return typeof microStore !== 'undefined';
    }
    get resource() {
        return typeof fetchCacheData !== 'undefined' ? fetchCacheData : {};
    }
}
