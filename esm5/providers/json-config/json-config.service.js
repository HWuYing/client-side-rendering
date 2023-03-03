import { __decorate, __extends, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { HttpClient, JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { cloneDeep } from 'lodash';
import { map, shareReplay } from 'rxjs';
import { JSON_TYPE } from './json-intercept';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService(injector, http) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.http = http;
        _this.cache = new Map();
        return _this;
    }
    JsonConfigService.prototype.getJsonConfig = function (url) {
        var _url = /http|https/.test(url) ? url : "".concat(url).replace(/\/+/g, '/');
        var params = { requestType: JSON_TYPE };
        var subject = this.cache.get(_url);
        if (!subject) {
            subject = this.http.get(_url, params).pipe(shareReplay(1), map(cloneDeep));
            this.cache.set(_url, subject);
        }
        return subject;
    };
    JsonConfigService = __decorate([
        Injectable(),
        __param(0, Inject(Injector)),
        __metadata("design:paramtypes", [Injector, HttpClient])
    ], JsonConfigService);
    return JsonConfigService;
}(SharedJsonConfigService));
export { JsonConfigService };
