import './plugin.effects';
import { ApplicationContext } from '@fm/core/platform/application';
import { Provider } from '@fm/di';
import { Render } from './index';
export declare const applicationContext: ApplicationContext;
declare class DynamicPlatform {
    private createPlatform;
    constructor(providers: Provider[]);
    bootstrapRender(providers: Provider[] | Render, render?: Render): Promise<void>;
}
export { PLATFORM_SCOPE } from '@fm/core/platform/application';
export declare const dynamicPlatform: (providers?: Provider[]) => DynamicPlatform;
export { ApplicationPlugin, Input, Prov, registerProvider } from '@fm/core/platform/decorator';
export declare const Application: <M extends import("@fm/core/platform/application").MetadataInfo>(metadata?: {
    [key: string]: any;
} | import("@fm/di").Type<M>) => <T = any>(cls: import("@fm/di").Type<T>) => import("@fm/di").Type<T>;
