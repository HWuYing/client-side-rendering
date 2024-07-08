import { MicroManageInterface } from '@hwy-fm/core/micro';
import { Injector } from '@hwy-fm/di';
import { Observable } from 'rxjs';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
export declare class MicroManage implements MicroManageInterface {
    private injector;
    private la;
    private microCache;
    constructor(injector: Injector, la: LoadAssets);
    bootstrapMicro(microName: string): Observable<MicroStore>;
    get sharedData(): SharedData;
}
