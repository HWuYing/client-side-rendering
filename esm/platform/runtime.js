import './plugin.effects';
import { createPlatformFactory } from '@fm/core/platform';
import { makeApplication } from '@fm/core/platform/decorator';
import { PLATFORM, PlatformOptions } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './index';
export { PLATFORM_SCOPE } from '@fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@fm/core/platform/decorator';
export const Application = makeApplication((applicationContext) => {
    const isMicro = typeof microStore !== 'undefined';
    const resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
    const createPlatform = createPlatformFactory(null, [
        { provide: PlatformOptions, useValue: { isMicro, resource } },
        { provide: PLATFORM, useClass: Platform, deps: [Injector, PlatformOptions] }
    ]);
    if (!isMicro) {
        createPlatform(applicationContext).bootstrapRender(applicationContext.providers);
    }
    else {
        microStore.render = (options = {}) => createPlatform(applicationContext).bootstrapMicroRender(applicationContext.providers, options);
    }
});
