import { Injector } from '@fm/di';
import { PLATFORM } from '@fm/shared';
import { createPlafformFactory, PlatformOptions } from '@fm/shared/providers/platform';
import { Platform } from './platform';
const isMicro = typeof microStore !== 'undefined';
const resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
const _CORE_PLATFORM_PROVIDERS = [
    { provide: PlatformOptions, useValue: { isMicro, resource } },
    { provide: Platform, deps: [Injector, PlatformOptions] },
    { provide: PLATFORM, useExisting: Platform }
];
class DyanmicPlatfom {
    constructor(providers) {
        this.createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS, providers);
    }
    bootstrapRender(providers, render) {
        if (!isMicro) {
            return this.createPlatform().bootstrapRender(providers, render);
        }
        microStore.render = (options) => this.createPlatform().bootstrapMicroRender(providers, render, options);
    }
}
export const dynamicPlatform = (providers = []) => new DyanmicPlatfom(providers);
