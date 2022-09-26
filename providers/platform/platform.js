"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
const json_config_1 = require("@fm/shared/providers/json-config");
const token_1 = require("../../token");
const app_context_2 = require("../app-context");
const json_config_2 = require("../json-config");
class Platform {
    providers;
    rootInjector = (0, di_1.getProvider)(di_1.Injector);
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
        const injector = new di_1.StaticInjector(this.rootInjector, { isScope: 'self' });
        const container = document.getElementById('app');
        const styleContainer = document.head;
        const appContext = { fetch, container, styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro, ...context };
        const _providers = [
            ...this.providers,
            { provide: app_context_1.APP_CONTEXT, useValue: appContext },
            { provide: json_config_1.JsonConfigService, useClass: json_config_2.JsonConfigService },
            { provide: app_context_1.AppContextService, useClass: app_context_2.AppContextService },
            ...providers
        ];
        _providers.forEach((provider) => injector.set(provider.provide, provider));
        return injector;
    }
    async importMicro(injector) {
        const importMicro = injector.get(token_1.IMPORT_MICRO);
        if (importMicro) {
            const { registryMicro, MicroManage } = await importMicro;
            registryMicro(this.rootInjector);
            injector.get(app_context_1.APP_CONTEXT).useMicroManage = () => injector.get(MicroManage);
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
exports.Platform = Platform;
