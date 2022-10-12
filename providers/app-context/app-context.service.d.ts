import { AppContextService as SharedAppContextService, Fetch } from '@fm/shared/providers/app-context';
import { ProxyFetch } from './proxy-fetch';
export declare class AppContextService extends SharedAppContextService {
    private resourceCache;
    protected proxyFetch: ProxyFetch;
    private createProxyFetch;
    getResourceCache(type?: string, needRemove?: boolean): any;
    get fetch(): Fetch;
}
