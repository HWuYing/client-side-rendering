import { MicroManageInterface, MicroStoreInterface } from '@fm/shared/micro';
import { StaticAssets } from '../load-assets/load-assets';
export declare class MicroStore implements MicroStoreInterface {
    private microName;
    private staticAssets;
    private microManage;
    private mountedList;
    private loaderStyleNodes;
    private execMountedList;
    private _renderMicro;
    constructor(microName: string, staticAssets: StaticAssets, microManage: MicroManageInterface);
    onMounted(container: HTMLElement, options?: any): Promise<any>;
    unMounted(container: HTMLElement): Promise<void>;
    private execMounted;
    private execJavascript;
    private parseRenderOptions;
    private headAppendChildProxy;
    private mountendAppendLoadStyleNode;
    private loadScriptContext;
    private loadBlobScript;
    protected formatSourceCode(source: string): string;
}
