import { __decorate, __metadata, __param, __rest } from "tslib";
import { Inject, Injectable } from '@fm/di';
import { createMicroElementTemplate, HttpFetchHandler, MICRO_OPTIONS, serializableAssets } from '@fm/shared';
import { isEmpty, merge } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { microOptions } from '../micro-options';
let LoadAssets = class LoadAssets {
    constructor(http, options = {}) {
        this.http = http;
        this.options = options;
        this.cacheServerData = this.initialCacheServerData();
        this.options = merge(microOptions, this.options);
    }
    initialCacheServerData() {
        return typeof microFetchData !== 'undefined' ? microFetchData : [];
    }
    parseStatic(microName, entrypoints) {
        const microData = this.cacheServerData.find(({ microName: _microName }) => microName === _microName);
        const fetchCacheData = JSON.parse(microData && microData.source || '[]');
        const staticAssets = Object.assign(Object.assign({}, serializableAssets(entrypoints)), { script: [], fetchCacheData });
        return this.readJavascript(staticAssets);
    }
    reeadLinkToStyles(links) {
        return isEmpty(links) ? of(links) : forkJoin(links.map((href) => this.fetchStatic(href)));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readJavascript(_a) {
        var { js, script } = _a, other = __rest(_a, ["js", "script"]);
        return forkJoin(js.map((src) => this.fetchStatic(src))).pipe(map((script) => (Object.assign({ script, js }, other))));
    }
    createMicroTag(microName, staticAssets) {
        const tag = document.createElement(`${microName}-tag`);
        return tag && tag.shadowRoot ? of(staticAssets) : this.reeadLinkToStyles(staticAssets.links).pipe(
        // eslint-disable-next-line no-new-func
        tap((linkToStyles) => new Function(createMicroElementTemplate(microName, { linkToStyles }))()), map(() => staticAssets));
    }
    fetchStatic(url, isText = true) {
        const { fetchHandler = this.http.handle.bind(this.http) } = this.options;
        return fetchHandler(url).pipe(mergeMap((res) => isText ? res.text() : res.json()));
    }
    readMicroStatic(microName) {
        const { assetsPath } = this.options;
        return this.fetchStatic(assetsPath(microName), false).pipe(switchMap((result) => this.parseStatic(microName, result)), switchMap((result) => this.createMicroTag(microName, result)));
    }
};
LoadAssets = __decorate([
    Injectable(),
    __param(1, Inject(MICRO_OPTIONS)),
    __metadata("design:paramtypes", [HttpFetchHandler, Object])
], LoadAssets);
export { LoadAssets };
