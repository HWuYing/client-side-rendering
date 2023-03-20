import { Injector } from '@fm/di';
import { HttpHandler, HttpInterceptor } from '@fm/core';
import { Observable } from 'rxjs';
import { AppContextService } from '../app-context/app-context.service';
export declare const JSON_TYPE = "json-config";
export declare class JsonIntercept implements HttpInterceptor {
    protected injector: Injector;
    appContext: AppContextService;
    protected cacheConfig: Map<string, Observable<object>>;
    constructor(injector: Injector);
    private createCache;
    private resetCacheConfig;
    private putGlobalSource;
    intercept(req: string, params: RequestInit | undefined, next: HttpHandler): Observable<Response>;
}
