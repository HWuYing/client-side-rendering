import { Fetch } from '@fm/core/common';
import { AppContextService as SharedAppContextService } from '@fm/core/providers';
export declare class AppContextService extends SharedAppContextService {
    private resourceCache;
    getResourceCache(type?: string, needRemove?: boolean): any;
    get fetch(): Fetch;
}
