import { Injector } from '@fm/di';
import { PLATFORM } from '@fm/core';
import { createPlafformFactory, PlatformOptions } from '@fm/core/providers/platform';
import { Platform } from './platform';
var isMicro = typeof microStore !== 'undefined';
var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
var _CORE_PLATFORM_PROVIDERS = [
    { provide: PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
    { provide: Platform, deps: [Injector, PlatformOptions] },
    { provide: PLATFORM, useExisting: Platform }
];
var DyanmicPlatfom = /** @class */ (function () {
    function DyanmicPlatfom(providers) {
        this.createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS, providers);
    }
    DyanmicPlatfom.prototype.bootstrapRender = function (providers, render) {
        var _this = this;
        if (!isMicro) {
            return this.createPlatform().bootstrapRender(providers, render);
        }
        microStore.render = function (options) { return _this.createPlatform().bootstrapMicroRender(providers, render, options); };
    };
    return DyanmicPlatfom;
}());
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new DyanmicPlatfom(providers);
};
