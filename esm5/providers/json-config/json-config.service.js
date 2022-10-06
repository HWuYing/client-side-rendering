import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { JsonConfigService as SharedJsonConfigService } from '@fm/shared/providers/json-config';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.http = _this.injector.get(HttpClient);
        return _this;
    }
    JsonConfigService.prototype.getServerFetchData = function (url) {
        var _a = (this.appContext.getEnvironment() || {}).publicPath, publicPath = _a === void 0 ? '/' : _a;
        return this.http.get(/http|https/.test(url) ? url : "".concat(publicPath, "/").concat(url).replace(/\/+/g, '/'));
    };
    JsonConfigService = __decorate([
        Injectable()
    ], JsonConfigService);
    return JsonConfigService;
}(SharedJsonConfigService));
export { JsonConfigService };
