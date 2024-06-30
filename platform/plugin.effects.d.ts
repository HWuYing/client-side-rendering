import { ApplicationContext } from '@fm/core/platform';
import { Injector } from '@fm/di';
export declare class Plugin {
    private ctx;
    private injector;
    private options;
    constructor(ctx: ApplicationContext, injector: Injector);
    microLoad(): Promise<void>;
    interceptHistory(): void;
    register(): Promise<void>;
}
