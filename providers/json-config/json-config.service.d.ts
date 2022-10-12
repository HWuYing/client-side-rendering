import { Injector } from '@fm/di';
import { HttpClient } from '@fm/shared';
import { JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { Observable } from 'rxjs';
import { AppContextService } from '../app-context';
export declare class JsonConfigService extends SharedJsonConfigService {
    protected injector: Injector;
    private http;
    appContext: AppContextService;
    protected cacheConfig: Map<string, Observable<object>>;
    constructor(injector: Injector, http: HttpClient);
    private createCache;
    private resetCacheConfig;
    protected getServerFetchData(url: string): Observable<object>;
    getJsonConfig(url: string): Observable<object>;
}
