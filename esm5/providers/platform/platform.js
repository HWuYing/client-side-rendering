import { getProvider, Injector, StaticInjector } from '@fm/di';
import { APP_CONTEXT, AppContextService } from '@fm/shared/providers/app-context';
import { JsonConfigService } from '@fm/shared/providers/json-config';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService } from '../json-config';
export class Platform {
    providers;
    rootInjector = getProvider(Injector);
    constructor(providers) {
        this.providers = providers;
    }
    bootstrapRender(render) {
        if (!this.isMicro) {
            return this.importMicro(this.beforeBootstrapRender()).then(render);
        }
        microStore.render = this.proxyRender.bind(this, render);
    }
    async proxyRender(render, options) {
        const { microManage, head, body, ..._options } = options;
        const microConfig = { container: body, styleContainer: head, useMicroManage: () => microManage };
        const injector = this.beforeBootstrapRender(microConfig);
        const unRender = await render(injector, _options);
        return (_container) => { unRender(_container); injector.clear(); };
    }
    beforeBootstrapRender(context = {}, providers = []) {
        const injector = new StaticInjector(this.rootInjector, { isScope: 'self' });
        const container = document.getElementById('app');
        const styleContainer = document.head;
        const appContext = { fetch, container, styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro, ...context };
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
    async importMicro(injector) {
        const importMicro = injector.get(IMPORT_MICRO);
        if (importMicro) {
            const { registryMicro, MicroManage } = await importMicro;
            registryMicro(this.rootInjector);
            injector.get(APP_CONTEXT).useMicroManage = () => injector.get(MicroManage);
        }
        return injector;
    }
    get isMicro() {
        return typeof microStore !== 'undefined';
    }
    get resource() {
        return typeof fetchCacheData !== 'undefined' ? fetchCacheData : {};
    }
}
