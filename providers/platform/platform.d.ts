import { Provider } from '@fm/di';
export declare type Render = (...args: any[]) => Promise<(container: HTMLElement) => void>;
export declare class Platform {
    private providers;
    private rootInjector;
    constructor(providers: Provider[]);
    bootstrapRender(render: Render): Promise<(container: HTMLElement) => void>;
    private proxyRender;
    private beforeBootstrapRender;
    private importMicro;
    private get isMicro();
    private get resource();
}
