import { Injector, Provider } from '@fm/di';
export declare class Platform {
    private platformInjector;
    private resource;
    private isMicro?;
    constructor(platformInjector: Injector, { isMicro, resource }: any);
    bootstrapRender(providers: Provider[]): Promise<void>;
    bootstrapMicroRender(providers: Provider[], options: any): Promise<(_container: HTMLElement) => void>;
    private beforeBootstrapRender;
    private runRender;
}
