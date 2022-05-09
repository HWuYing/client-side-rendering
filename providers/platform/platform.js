"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
const json_config_1 = require("@fm/shared/providers/json-config");
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
        const { registryMicro, MicroManage } = await Promise.resolve().then(() => __importStar(require('../../micro/import-micro')));
        registryMicro(injector);
        injector.get(app_context_1.APP_CONTEXT).useMicroManage = () => injector.get(MicroManage);
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
