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
export { ApplicationPlugin, createRegisterLoader, Input, Prov, registerProvider, runtimeInjector } from '@fm/core/platform/decorator';
export declare const Application: (metadata?: {
    [key: string]: any;
} | import("@fm/di").Type<import("@fm/core/platform/application").MetadataInfo>) => ClassDecorator;
