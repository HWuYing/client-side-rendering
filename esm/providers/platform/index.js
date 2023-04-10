import { ApplicationContext, createPlatformFactory, PlatformOptions } from '@fm/core/providers/platform';
import { PLATFORM } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './platform';
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
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export const dynamicPlatform = (providers = []) => new DynamicPlatform(providers);
applicationContext.registerStart(() => dynamicPlatform().bootstrapRender(applicationContext.providers));
export const Application = applicationContext.makeApplicationDecorator();
export const Prov = applicationContext.makeProvDecorator('MethodDecorator');
export const Input = applicationContext.makePropInput('InputPropDecorator');
