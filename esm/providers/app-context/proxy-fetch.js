export class ProxyFetch {
    constructor(_fetch, fetchCache) {
        this._fetch = _fetch;
        this.fetchCache = fetchCache;
    }
    getCacheSource(url, init) {
        const cache = this.fetchCache.find((item) => item.url === url);
        return cache && cache.method === (init === null || init === void 0 ? void 0 : init.method) ? cache : null;
    }
    base64ToUint8Array(base64) {
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++)
            array[i] = raw.charCodeAt(i);
        return array;
    }
    createResponse(cache) {
        const data = this.base64ToUint8Array(cache.source);
        const response = new Response(new ReadableStream({
            start: (controller) => {
                controller.enqueue(data);
                controller.close();
            }
        }));
        return response;
    }
    fetch(url, init) {
        const cache = this.getCacheSource(url, init);
        if (cache) {
            delete this.fetchCache[url];
            return Promise.resolve(this.createResponse(cache));
        }
        return this._fetch(url, init);
    }
}
