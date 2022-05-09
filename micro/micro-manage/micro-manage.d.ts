import { LocatorStorage } from '@fm/di';
import { MicroManageInterface } from '@fm/shared/micro';
import { Observable, Subject } from '@fm/import-rxjs';
import { LoadAssets } from '../load-assets/load-assets';
import { MicroStore } from '../micro-store/micro-store';
import { SharedData } from '../shared-data/share-data';
export declare class MicroManage implements MicroManageInterface {
    private ls;
    private la;
    loaderStyleSubject: Subject<HTMLStyleElement>;
    private chunkMap;
    private microCache;
    constructor(ls: LocatorStorage, la: LoadAssets);
    bootstrapMicro(microName: string): Observable<MicroStore>;
    private querySelectorProxy;
    private proxyAppendLink;
    get sharedData(): SharedData;
}
