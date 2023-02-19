"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroManage = exports.registryMicro = void 0;
var shared_1 = require("@fm/shared");
var micro_options_1 = require("../micro-options");
var registryMicro = function () { return [{ provide: shared_1.MICRO_OPTIONS, useValue: micro_options_1.microOptions }]; };
exports.registryMicro = registryMicro;
var micro_manage_1 = require("../micro-manage/micro-manage");
Object.defineProperty(exports, "MicroManage", { enumerable: true, get: function () { return micro_manage_1.MicroManage; } });
