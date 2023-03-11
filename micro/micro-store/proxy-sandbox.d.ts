import { MicroManageInterface } from '@fm/shared/micro';
import { Subject } from 'rxjs';
import { StaticAssets } from '../load-assets/load-assets';
export declare class ProxySandbox {
    private microManage;
    private staticAssets;
    loaderStyleSubject: Subject<HTMLElement>;
    constructor(microManage: MicroManageInterface, staticAssets: StaticAssets);
    createShanbox(shadow?: ShadowRoot): {
        window: Window & typeof globalThis;
        document: Document;
    };
    protected linkToStyle(link: HTMLLinkElement): Promise<void>;
    protected appendChild(node: HTMLElement): Promise<void>;
    protected docProxy(shadow?: ShadowRoot): any;
    protected querySelector(head: HTMLHeadElement, body: HTMLElement, shadow?: Document | ShadowRoot): (selectors: string) => Element;
    protected propProxy<T extends object>(proxy: any): ProxyHandler<T>;
    protected bindMethod(target: any, props: string): any;
}
