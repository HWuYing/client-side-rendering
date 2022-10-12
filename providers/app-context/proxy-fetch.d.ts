import { Fetch } from "@fm/shared/providers/app-context";
export declare class ProxyFetch {
    private _fetch;
    private fetchCache;
    constructor(_fetch: Fetch, fetchCache: {
        [key: string]: any;
    });
    private getCacheSource;
    private base64ToUint8Array;
    private createResponse;
    fetch(url: string, init?: RequestInit): Promise<Response>;
}
