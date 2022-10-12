import { Injector } from '@fm/di';
import { MicroManageInterface } from '@fm/shared/micro/types';
import { Observable, Subject } from 'rxjs';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
export declare class MicroManage implements MicroManageInterface {
    private injector;
    private la;
    loaderStyleSubject: Subject<HTMLStyleElement>;
    private chunkMap;
    private microCache;
    constructor(injector: Injector, la: LoadAssets);
    bootstrapMicro(microName: string): Observable<MicroStore>;
    private querySelectorProxy;
    private proxyAppendLink;
    get sharedData(): SharedData;
}
