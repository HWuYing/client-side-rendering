"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = exports.registryMicro = void 0;
var token_1 = require("@fm/shared/token");
var micro_options_1 = require("../micro-options");
var registryMicro = function (injector) {
    var providers = [{ provide: token_1.MICRO_OPTIONS, useValue: micro_options_1.microOptions }];
    providers.forEach(function (provider) { return injector.set(provider.provide, provider); });
};
exports.registryMicro = registryMicro;
var micro_manage_1 = require("../micro-manage/micro-manage");
Object.defineProperty(exports, "MicroManage", { enumerable: true, get: function () { return micro_manage_1.MicroManage; } });
