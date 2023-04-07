"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.Prov = exports.Application = exports.dynamicPlatform = exports.PLATFORM_SCOPE = exports.applicationContext = void 0;
var platform_1 = require("@fm/core/providers/platform");
var token_1 = require("@fm/core/token");
var di_1 = require("@fm/di");
var platform_2 = require("./platform");
var isMicro = typeof microStore !== 'undefined';
var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
exports.applicationContext = new platform_1.ApplicationContext();
var _CORE_PLATFORM_PROVIDERS = [
    { provide: platform_1.PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
    { provide: platform_2.Platform, deps: [di_1.Injector, platform_1.PlatformOptions] },
    { provide: token_1.PLATFORM, useExisting: platform_2.Platform },
    { provide: platform_1.ApplicationContext, useFactory: function () { return exports.applicationContext; } }
];
var DynamicPlatform = /** @class */ (function () {
    function DynamicPlatform(providers) {
        this.createPlatform = (0, platform_1.createPlatformFactory)(null, _CORE_PLATFORM_PROVIDERS, providers);
    }
    DynamicPlatform.prototype.bootstrapRender = function (providers, render) {
        var _this = this;
        if (!isMicro) {
            return this.createPlatform(exports.applicationContext).bootstrapRender(providers, render);
        }
        microStore.render = function (options) { return _this.createPlatform(exports.applicationContext).bootstrapMicroRender(providers, render, options); };
    };
    return DynamicPlatform;
}());
var platform_3 = require("@fm/core/providers/platform");
Object.defineProperty(exports, "PLATFORM_SCOPE", { enumerable: true, get: function () { return platform_3.PLATFORM_SCOPE; } });
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new DynamicPlatform(providers);
};
exports.dynamicPlatform = dynamicPlatform;
exports.applicationContext.registerStart(function () { return (0, exports.dynamicPlatform)().bootstrapRender(exports.applicationContext.providers); });
exports.Application = exports.applicationContext.makeApplicationDecorator();
exports.Prov = exports.applicationContext.makeProvDecorator('MethodDecorator');
exports.Input = exports.applicationContext.makePropInput('InputPropDecorator');
