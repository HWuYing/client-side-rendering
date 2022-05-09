import { HttpClient } from '@fm/shared/common/http';
import { Observable } from '@fm/import-rxjs';
export interface StaticAssets {
    script: string[];
    javascript: string[];
    links: string[];
    fetchCacheData: {
        [url: string]: any;
    };
}
export declare class LoadAssets {
    private http;
    private options;
    private cacheServerData;
    constructor(http: HttpClient, options?: any);
    private initialCacheServerData;
    private parseStatic;
    private reeadLinkToStyles;
    private readJavascript;
    private createMicroTag;
    readMicroStatic(microName: string): Observable<any>;
}
