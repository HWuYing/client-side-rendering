"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.registerProvider = exports.Prov = exports.Input = exports.ApplicationPlugin = exports.dynamicPlatform = exports.PLATFORM_SCOPE = exports.applicationContext = void 0;
require("./plugin.effects");
var platform_1 = require("@fm/core/platform");
var application_1 = require("@fm/core/platform/application");
var token_1 = require("@fm/core/token");
var di_1 = require("@fm/di");
var index_1 = require("./index");
var isMicro = typeof microStore !== 'undefined';
var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
exports.applicationContext = new application_1.ApplicationContext();
var _CORE_PLATFORM_PROVIDERS = [
    { provide: token_1.PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
    { provide: index_1.Platform, deps: [di_1.Injector, token_1.PlatformOptions] },
    { provide: token_1.PLATFORM, useExisting: index_1.Platform }
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
var application_2 = require("@fm/core/platform/application");
Object.defineProperty(exports, "PLATFORM_SCOPE", { enumerable: true, get: function () { return application_2.PLATFORM_SCOPE; } });
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new DynamicPlatform(providers);
};
exports.dynamicPlatform = dynamicPlatform;
exports.applicationContext.registerStart(function () { return (0, exports.dynamicPlatform)().bootstrapRender(exports.applicationContext.providers); });
var decorator_1 = require("@fm/core/platform/decorator");
Object.defineProperty(exports, "ApplicationPlugin", { enumerable: true, get: function () { return decorator_1.ApplicationPlugin; } });
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return decorator_1.Input; } });
Object.defineProperty(exports, "Prov", { enumerable: true, get: function () { return decorator_1.Prov; } });
Object.defineProperty(exports, "registerProvider", { enumerable: true, get: function () { return decorator_1.registerProvider; } });
exports.Application = exports.applicationContext.makeApplicationDecorator();
