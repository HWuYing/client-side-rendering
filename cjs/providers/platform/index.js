"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPlatform = void 0;
var di_1 = require("@fm/di");
var core_1 = require("@fm/core");
var platform_1 = require("@fm/core/providers/platform");
var platform_2 = require("./platform");
var isMicro = typeof microStore !== 'undefined';
var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
var _CORE_PLATFORM_PROVIDERS = [
    { provide: platform_1.PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
    { provide: platform_2.Platform, deps: [di_1.Injector, platform_1.PlatformOptions] },
    { provide: core_1.PLATFORM, useExisting: platform_2.Platform }
];
var DyanmicPlatfom = /** @class */ (function () {
    function DyanmicPlatfom(providers) {
        this.createPlatform = (0, platform_1.createPlafformFactory)(null, _CORE_PLATFORM_PROVIDERS, providers);
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
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new DyanmicPlatfom(providers);
};
exports.dynamicPlatform = dynamicPlatform;
