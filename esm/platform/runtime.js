import './plugin.effects';
import { createPlatformFactory } from '@fm/core/platform';
import { ApplicationContext } from '@fm/core/platform/application';
import { PLATFORM, PlatformOptions } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './index';
const isMicro = typeof microStore !== 'undefined';
const resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
export const applicationContext = new ApplicationContext();
const _CORE_PLATFORM_PROVIDERS = [
    { provide: PlatformOptions, useValue: { isMicro, resource } },
    { provide: Platform, deps: [Injector, PlatformOptions] },
    { provide: PLATFORM, useExisting: Platform }
];
class DynamicPlatform {
    constructor(providers) {
        this.createPlatform = createPlatformFactory(null, _CORE_PLATFORM_PROVIDERS, providers);
    }
    bootstrapRender(providers, render) {
        if (!isMicro) {
            return this.createPlatform(applicationContext).bootstrapRender(providers, render);
        }
        microStore.render = (options) => this.createPlatform(applicationContext).bootstrapMicroRender(providers, render, options);
    }
}
export { PLATFORM_SCOPE } from '@fm/core/platform/application';
export const dynamicPlatform = (providers = []) => new DynamicPlatform(providers);
applicationContext.registerStart(() => dynamicPlatform().bootstrapRender(applicationContext.providers));
export { ApplicationPlugin, createRegisterLoader, Input, Prov, registerProvider, runtimeInjector } from '@fm/core/platform/decorator';
export const Application = applicationContext.makeApplicationDecorator();
