import { __decorate, __metadata } from "tslib";
import { HttpClient, JsonConfigService as SharedJsonConfigService } from '@fm/core';
import { Injectable, Injector } from '@fm/di';
import { cloneDeep } from 'lodash';
import { map, shareReplay } from 'rxjs';
import { JSON_TYPE } from './json-intercept';
let JsonConfigService = class JsonConfigService extends SharedJsonConfigService {
    constructor(injector, http) {
        super(injector);
        this.injector = injector;
        this.http = http;
        this.cache = new Map();
    }
    getJsonConfig(url) {
        url = /http|https/.test(url) ? url : url.replace(/\/+/g, '/');
        let subject = this.cache.get(url);
        if (!subject) {
            subject = this.http.get(url, { requestType: JSON_TYPE }).pipe(shareReplay(1), map(cloneDeep));
            this.cache.set(url, subject);
        }
        return subject;
    }
};
JsonConfigService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Injector, HttpClient])
], JsonConfigService);
export { JsonConfigService };
