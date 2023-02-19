import { Provider } from '@fm/di';
import { Render } from './platform';
declare class DyanmicPlatfom {
    private createPlatform;
    constructor(providers: Provider[]);
    bootstrapRender(providers: Provider[] | Render, render?: Render): Promise<void>;
}
export declare const dynamicPlatform: (providers?: Provider[]) => DyanmicPlatfom;
export {};
