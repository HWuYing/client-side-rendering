import { AppContextService as SharedAppContextService } from '@fm/shared';
import { Fetch } from '@fm/shared/common';
export declare class AppContextService extends SharedAppContextService {
    private resourceCache;
    getResourceCache(type?: string, needRemove?: boolean): any;
    get fetch(): Fetch;
}
