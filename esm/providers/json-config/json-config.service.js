import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Injector } from '@fm/di';
import { HttpClient, JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { cloneDeep } from 'lodash';
import { map, shareReplay } from 'rxjs';
import { AppContextService } from '../app-context';
import { JSON_TYPE } from './json-intercept';
let JsonConfigService = class JsonConfigService extends SharedJsonConfigService {
    constructor(injector, http) {
        super(injector);
        this.injector = injector;
        this.http = http;
        this.cache = new Map();
    }
    getJsonConfig(url) {
        const { publicPath = '/' } = this.injector.get(AppContextService).getEnvironment() || {};
        const _url = /http|https/.test(url) ? url : `${publicPath}/${url}`.replace(/\/+/g, '/');
        const params = { requestType: JSON_TYPE };
        let subject = this.cache.get(_url);
        if (!subject) {
            subject = this.http.get(_url, params).pipe(shareReplay(1), map(cloneDeep));
            this.cache.set(_url, subject);
        }
        return subject;
    }
};
JsonConfigService = __decorate([
    Injectable(),
    __param(0, Inject(Injector)),
    __metadata("design:paramtypes", [Injector, HttpClient])
], JsonConfigService);
export { JsonConfigService };
