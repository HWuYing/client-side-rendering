import { Injector, Provider } from '@fm/di';
export declare type Render = (...args: any[]) => Promise<(container: HTMLElement) => void>;
export declare class Platform {
    private platformInjector;
    private resource;
    private isMicro?;
    constructor(platformInjector: Injector, { isMicro, resource }: any);
    bootstrapRender(additionalProviders: Provider[] | Render, render?: Render): Promise<void>;
    bootstrapMicroRender(additionalProviders: Provider[] | Render, render?: Render, options?: any): Promise<(_container: HTMLElement) => void>;
    private beforeBootstrapRender;
    private importMicro;
    private regeditHistory;
    private parseParams;
}
