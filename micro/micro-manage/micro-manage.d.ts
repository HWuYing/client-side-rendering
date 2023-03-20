import { Injector } from '@fm/di';
import { MicroManageInterface } from '@fm/core/micro';
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
