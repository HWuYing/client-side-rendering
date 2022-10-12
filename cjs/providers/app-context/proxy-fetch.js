"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyFetch = void 0;
var ProxyFetch = /** @class */ (function () {
    function ProxyFetch(_fetch, fetchCache) {
        this._fetch = _fetch;
        this.fetchCache = fetchCache;
    }
    ProxyFetch.prototype.getCacheSource = function (url, init) {
        var cache = this.fetchCache.find(function (item) { return item.url === url; });
        return cache && cache.method === (init === null || init === void 0 ? void 0 : init.method) ? cache : null;
    };
    ProxyFetch.prototype.base64ToUint8Array = function (base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++)
            array[i] = raw.charCodeAt(i);
        return array;
    };
    ProxyFetch.prototype.createResponse = function (cache) {
        var data = this.base64ToUint8Array(cache.source);
        var response = new Response(new ReadableStream({
            start: function (controller) {
                controller.enqueue(data);
                controller.close();
            }
        }));
        return response;
    };
    ProxyFetch.prototype.fetch = function (url, init) {
        var cache = this.getCacheSource(url, init);
        if (cache) {
            delete this.fetchCache[url];
            return Promise.resolve(this.createResponse(cache));
        }
        return this._fetch(url, init);
    };
    return ProxyFetch;
}());
exports.ProxyFetch = ProxyFetch;
