import { __decorate, __extends, __metadata } from "tslib";
import { HttpClient, JsonConfigService as SharedJsonConfigService } from '@fm/core';
import { Injectable, Injector } from '@fm/di';
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
        url = /http|https/.test(url) ? url : url.replace(/\/+/g, '/');
        var subject = this.cache.get(url);
        if (!subject) {
            subject = this.http.get(url, { requestType: JSON_TYPE }).pipe(shareReplay(1), map(cloneDeep));
            this.cache.set(url, subject);
        }
        return subject;
    };
    JsonConfigService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Injector, HttpClient])
    ], JsonConfigService);
    return JsonConfigService;
}(SharedJsonConfigService));
export { JsonConfigService };
