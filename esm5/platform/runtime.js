import './plugin.effects';
import { createPlatformFactory } from '@fm/core/platform';
import { makeApplication } from '@fm/core/platform/decorator';
import { PLATFORM, PlatformOptions } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './index';
export { PLATFORM_SCOPE } from '@fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@fm/core/platform/decorator';
export var Application = makeApplication(function (applicationContext) {
    var isMicro = typeof microStore !== 'undefined';
    var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
    var createPlatform = createPlatformFactory(null, [
        { provide: PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
        { provide: PLATFORM, useClass: Platform, deps: [Injector, PlatformOptions] }
    ]);
    if (!isMicro) {
        createPlatform(applicationContext).bootstrapRender(applicationContext.providers);
    }
    else {
        microStore.render = function (options) {
            if (options === void 0) { options = {}; }
            return createPlatform(applicationContext).bootstrapMicroRender(applicationContext.providers, options);
        };
    }
});
