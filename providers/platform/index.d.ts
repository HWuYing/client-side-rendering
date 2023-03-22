import { Provider } from '@fm/di';
import { Render } from './platform';
declare class DyanmicPlatfom {
    private createPlatform;
    constructor(providers: Provider[]);
    bootstrapRender(providers: Provider[] | Render, render?: Render): Promise<void>;
}
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export declare const dynamicPlatform: (providers?: Provider[]) => DyanmicPlatfom;
export declare const Application: (this: unknown, ...args: any[]) => (cls: import("@fm/di").Type<any>) => any;
export declare const Prov: (this: unknown, ...args: any[]) => any;
