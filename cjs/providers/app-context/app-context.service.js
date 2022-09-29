"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const app_context_1 = require("@fm/shared/providers/app-context");
let AppContextService = class AppContextService extends app_context_1.AppContextService {
};
AppContextService = tslib_1.__decorate([
    (0, di_1.Injectable)()
], AppContextService);
exports.AppContextService = AppContextService;
