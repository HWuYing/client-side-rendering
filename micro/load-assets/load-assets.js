"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadAssets = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const http_1 = require("@fm/shared/common/http");
const micro_1 = require("@fm/shared/micro");
const token_1 = require("@fm/shared/token");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const defaultAssetsPath = (microName) => `/static/${microName}/static/assets.json`;
const defaultOptions = { assetsPath: defaultAssetsPath };
let LoadAssets = class LoadAssets {
    http;
    options;
    cacheServerData = this.initialCacheServerData();
    constructor(http, options = {}) {
        this.http = http;
        this.options = options;
        this.options = (0, lodash_1.merge)(defaultOptions, this.options);
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
        return (0, lodash_1.isEmpty)(links) ? (0, rxjs_1.of)(links) : (0, rxjs_1.forkJoin)(links.map((href) => this.http.getText(href)));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readJavascript({ javascript, script, ...other }) {
        return (0, rxjs_1.forkJoin)(javascript.map((src) => this.http.getText(src))).pipe((0, operators_1.map)((js) => ({ script: js, javascript, ...other })));
    }
    createMicroTag(microName, staticAssets) {
        const tag = document.createElement(`${microName}-tag`);
        return tag && tag.shadowRoot ? (0, rxjs_1.of)(staticAssets) : this.reeadLinkToStyles(staticAssets.links).pipe(
        // eslint-disable-next-line no-new-func
        (0, operators_1.tap)((linkToStyles) => new Function((0, micro_1.createMicroElementTemplate)(microName, { linkToStyles }))()), (0, operators_1.map)(() => staticAssets));
    }
    readMicroStatic(microName) {
        const { assetsPath } = this.options;
        return this.http.get(assetsPath(microName)).pipe((0, operators_1.switchMap)((result) => this.parseStatic(microName, result)), (0, operators_1.switchMap)((result) => this.createMicroTag(microName, result)));
    }
};
LoadAssets = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__param(1, (0, di_1.Inject)(token_1.MICRO_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [http_1.HttpClient, Object])
], LoadAssets);
exports.LoadAssets = LoadAssets;
