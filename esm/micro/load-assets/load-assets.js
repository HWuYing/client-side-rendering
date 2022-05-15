import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@fm/di';
import { forkJoin, map, of, switchMap, tap } from '@fm/import-rxjs';
import { HttpClient } from '@fm/shared/common/http';
import { createMicroElementTemplate } from '@fm/shared/micro';
import { MICRO_OPTIONS } from '@fm/shared/token';
import { isEmpty, merge } from 'lodash';
import { microOptions } from '../micro-options';
let LoadAssets = class LoadAssets {
    http;
    options;
    cacheServerData = this.initialCacheServerData();
    constructor(http, options = {}) {
        this.http = http;
        this.options = options;
        this.options = merge(microOptions, this.options);
    }
    initialCacheServerData() {
        return typeof microFetchData !== 'undefined' ? microFetchData : [];
    }
    parseStatic(microName, entrypoints) {
        const entryKeys = Object.keys(entrypoints);
        const microData = this.cacheServerData.find(({ microName: _microName }) => microName === _microName);
        const fetchCacheData = JSON.parse(microData && microData.source || '{}');
        const staticAssets = { javascript: [], script: [], links: [], fetchCacheData };
        entryKeys.forEach((staticKey) => {
            const { js: staticJs = [], css: staticLinks = [] } = entrypoints[staticKey];
            staticAssets.javascript.push(...staticJs);
            staticAssets.links.push(...staticLinks);
        });
        return this.readJavascript(staticAssets);
    }
    reeadLinkToStyles(links) {
        return isEmpty(links) ? of(links) : forkJoin(links.map((href) => this.http.getText(href)));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readJavascript({ javascript, script, ...other }) {
        return forkJoin(javascript.map((src) => this.http.getText(src))).pipe(map((js) => ({ script: js, javascript, ...other })));
    }
    createMicroTag(microName, staticAssets) {
        const tag = document.createElement(`${microName}-tag`);
        return tag && tag.shadowRoot ? of(staticAssets) : this.reeadLinkToStyles(staticAssets.links).pipe(
        // eslint-disable-next-line no-new-func
        tap((linkToStyles) => new Function(createMicroElementTemplate(microName, { linkToStyles }))()), map(() => staticAssets));
    }
    readMicroStatic(microName) {
        const { assetsPath } = this.options;
        return this.http.get(assetsPath(microName)).pipe(switchMap((result) => this.parseStatic(microName, result)), switchMap((result) => this.createMicroTag(microName, result)));
    }
};
LoadAssets = __decorate([
    Injectable(),
    __param(1, Inject(MICRO_OPTIONS)),
    __metadata("design:paramtypes", [HttpClient, Object])
], LoadAssets);
export { LoadAssets };
