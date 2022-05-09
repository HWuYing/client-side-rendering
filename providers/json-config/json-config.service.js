import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { HttpClient } from '@fm/shared/common/http';
import { JsonConfigService as SharedJsonConfigService } from '@fm/shared/providers/json-config';
let JsonConfigService = class JsonConfigService extends SharedJsonConfigService {
    http = this.ls.getService(HttpClient);
    getServerFetchData(url) {
        const { publicPath = '/' } = this.appContext.getEnvironment() || {};
        return this.http.get(/http|https/.test(url) ? url : `${publicPath}/${url}`.replace(/\/+/g, '/'));
    }
};
JsonConfigService = __decorate([
    Injectable()
], JsonConfigService);
export { JsonConfigService };
