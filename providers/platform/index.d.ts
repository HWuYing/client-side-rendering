import { ApplicationContext } from '@fm/core/providers/platform';
import { Provider } from '@fm/di';
import { Render } from './platform';
export declare const applicationContext: ApplicationContext;
declare class DynamicPlatform {
    private createPlatform;
    constructor(providers: Provider[]);
    bootstrapRender(providers: Provider[] | Render, render?: Render): Promise<void>;
}
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export declare const dynamicPlatform: (providers?: Provider[]) => DynamicPlatform;
export declare const Application: <M extends import("../..").MetadataInfo>(metadata?: {
    [key: string]: any;
} | import("@fm/di").Type<M>) => <T = any>(cls: import("@fm/di").Type<T>) => import("@fm/di").Type<T>;
export declare const Prov: (token: import("@fm/di").TokenKey, provider?: {
    [key: string]: any;
    providedIn?: string;
}) => any;
export declare const Input: (key: string) => any;
