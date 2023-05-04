import { Injector, Provider } from '@fm/di';
export type Render = (...args: any[]) => Promise<(container: HTMLElement) => void>;
export declare class Platform {
    private platformInjector;
    private resource;
    private isMicro?;
    constructor(platformInjector: Injector, { isMicro, resource }: any);
    bootstrapRender(additionalProviders: Provider[] | Render, render?: Render): Promise<void>;
    bootstrapMicroRender(additionalProviders: Provider[] | Render, render?: Render, options?: any): Promise<(_container: HTMLElement) => void>;
    private beforeBootstrapRender;
    private importMicro;
    private registerHistory;
    private runRender;
    private parseParams;
}
