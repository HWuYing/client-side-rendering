import { ApplicationContext, createPlafformFactory, PlatformOptions } from '@fm/core/providers/platform';
import { PLATFORM } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './platform';
var isMicro = typeof microStore !== 'undefined';
var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
var applicationContext = new ApplicationContext();
var _CORE_PLATFORM_PROVIDERS = [
    { provide: PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
    { provide: Platform, deps: [Injector, PlatformOptions] },
    { provide: PLATFORM, useExisting: Platform },
    { provide: ApplicationContext, useFactory: function () { return applicationContext; } }
];
var DyanmicPlatfom = /** @class */ (function () {
    function DyanmicPlatfom(providers) {
        this.createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS, providers);
    }
    DyanmicPlatfom.prototype.bootstrapRender = function (providers, render) {
        var _this = this;
        if (!isMicro) {
            return this.createPlatform(applicationContext).bootstrapRender(providers, render);
        }
        microStore.render = function (options) { return _this.createPlatform(applicationContext).bootstrapMicroRender(providers, render, options); };
    };
    return DyanmicPlatfom;
}());
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new DyanmicPlatfom(providers);
};
applicationContext.regeditStart(function () { return dynamicPlatform().bootstrapRender(applicationContext.providers); });
export var Application = applicationContext.makeApplicationDecorator();
export var Prov = applicationContext.makeProvDecorator('MethodDecorator');
