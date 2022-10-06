"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfigService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var http_1 = require("@fm/shared/common/http");
var json_config_1 = require("@fm/shared/providers/json-config");
var JsonConfigService = /** @class */ (function (_super) {
    tslib_1.__extends(JsonConfigService, _super);
    function JsonConfigService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.http = _this.injector.get(http_1.HttpClient);
        return _this;
    }
    JsonConfigService.prototype.getServerFetchData = function (url) {
        var _a = (this.appContext.getEnvironment() || {}).publicPath, publicPath = _a === void 0 ? '/' : _a;
        return this.http.get(/http|https/.test(url) ? url : "".concat(publicPath, "/").concat(url).replace(/\/+/g, '/'));
    };
    JsonConfigService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], JsonConfigService);
    return JsonConfigService;
}(json_config_1.JsonConfigService));
exports.JsonConfigService = JsonConfigService;
