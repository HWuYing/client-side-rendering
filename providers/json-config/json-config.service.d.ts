import { Injector } from '@fm/di';
import { HttpClient, JsonConfigService as SharedJsonConfigService } from '@fm/shared';
import { Observable } from 'rxjs';
export declare class JsonConfigService extends SharedJsonConfigService {
    protected injector: Injector;
    private http;
    private cache;
    constructor(injector: Injector, http: HttpClient);
    getJsonConfig(url: string): Observable<object>;
}
