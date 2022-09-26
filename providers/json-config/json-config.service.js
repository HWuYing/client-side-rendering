"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const http_1 = require("@fm/shared/common/http");
const json_config_1 = require("@fm/shared/providers/json-config");
let JsonConfigService = class JsonConfigService extends json_config_1.JsonConfigService {
    http = this.injector.get(http_1.HttpClient);
    getServerFetchData(url) {
        const { publicPath = '/' } = this.appContext.getEnvironment() || {};
        return this.http.get(/http|https/.test(url) ? url : `${publicPath}/${url}`.replace(/\/+/g, '/'));
    }
};
JsonConfigService = tslib_1.__decorate([
    (0, di_1.Injectable)()
], JsonConfigService);
exports.JsonConfigService = JsonConfigService;
