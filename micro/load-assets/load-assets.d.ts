import { HttpFetchHandler } from '@hwy-fm/core';
import { Observable } from 'rxjs';
export interface StaticAssets {
    script: string[];
    js: string[];
    links: string[];
    fetchCacheData: {
        [url: string]: any;
    };
}
export declare class LoadAssets {
    private http;
    private options;
    private cacheServerData;
    constructor(http: HttpFetchHandler, options?: any);
    private initialCacheServerData;
    private parseStatic;
    private readLinkToStyles;
    private readJavascript;
    private createMicroTag;
    fetchStatic<T = any>(url: string, isText?: boolean): Observable<T>;
    readMicroStatic(microName: string): Observable<any>;
}
