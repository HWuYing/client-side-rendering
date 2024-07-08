"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.runtimeInjector = exports.Register = exports.Prov = exports.Input = exports.createRegisterLoader = exports.ApplicationPlugin = exports.PLATFORM_SCOPE = void 0;
require("./plugin.effects");
var platform_1 = require("@hwy-fm/core/platform");
var decorator_1 = require("@hwy-fm/core/platform/decorator");
var token_1 = require("@hwy-fm/core/token");
var di_1 = require("@hwy-fm/di");
var index_1 = require("./index");
var platform_2 = require("@hwy-fm/core/platform");
Object.defineProperty(exports, "PLATFORM_SCOPE", { enumerable: true, get: function () { return platform_2.PLATFORM_SCOPE; } });
var decorator_2 = require("@hwy-fm/core/platform/decorator");
Object.defineProperty(exports, "ApplicationPlugin", { enumerable: true, get: function () { return decorator_2.ApplicationPlugin; } });
Object.defineProperty(exports, "createRegisterLoader", { enumerable: true, get: function () { return decorator_2.createRegisterLoader; } });
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return decorator_2.Input; } });
Object.defineProperty(exports, "Prov", { enumerable: true, get: function () { return decorator_2.Prov; } });
Object.defineProperty(exports, "Register", { enumerable: true, get: function () { return decorator_2.Register; } });
Object.defineProperty(exports, "runtimeInjector", { enumerable: true, get: function () { return decorator_2.runtimeInjector; } });
exports.Application = (0, decorator_1.makeApplication)(function (applicationContext) {
    var isMicro = typeof microStore !== 'undefined';
    var resource = typeof fetchCacheData !== 'undefined' ? fetchCacheData : [];
    var createPlatform = (0, platform_1.createPlatformFactory)(null, [
        { provide: token_1.PlatformOptions, useValue: { isMicro: isMicro, resource: resource } },
        { provide: token_1.PLATFORM, useClass: index_1.Platform, deps: [di_1.Injector, token_1.PlatformOptions] }
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
