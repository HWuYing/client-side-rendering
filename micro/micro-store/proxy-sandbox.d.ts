import { MicroManageInterface } from '@fm/core/micro';
import { Subject } from 'rxjs';
import { StaticAssets } from '../load-assets/load-assets';
export declare class ProxySandbox {
    private microManage;
    private staticAssets;
    private cache;
    loaderStyleSubject: Subject<HTMLElement>;
    loaderScriptSubject: Subject<[StaticAssets, {
        [key: string]: any;
    }]>;
    constructor(microManage: MicroManageInterface, staticAssets: StaticAssets);
    createShanbox(shadow?: ShadowRoot): any;
    protected linkToStyle(link: HTMLLinkElement): Promise<void>;
    protected srcToScript(shadBox: any, node: HTMLScriptElement): Promise<void>;
    protected appendChild(shadBox: any, node: HTMLElement): Promise<void>;
    protected docProxy(shadBox: any, shadow?: ShadowRoot): any;
    protected querySelector(head: HTMLHeadElement, body: HTMLElement, shadow?: Document | ShadowRoot): (selectors: string) => Element;
    protected propProxy<T extends object>(proxy: any): ProxyHandler<T>;
    protected bindMethod(target: any, props: string): any;
}
