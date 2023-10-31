import { ApplicationContext } from '@fm/core/platform/application';
import { Injector } from '@fm/di';
export declare class Plugin {
    private ctx;
    private injector;
    private options;
    constructor(ctx: ApplicationContext, injector: Injector);
    microLoad(): Promise<void>;
    interceptHistory(): Promise<void>;
    register(): Promise<void>;
}
