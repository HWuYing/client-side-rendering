import { ApplicationContext } from '@hwy-fm/core/platform';
import { Injector } from '@hwy-fm/di';
export declare class Plugin {
    private ctx;
    private injector;
    static __order__: number;
    private options;
    constructor(ctx: ApplicationContext, injector: Injector);
    microLoad(): Promise<void>;
    interceptHistory(): void;
    register(): Promise<void>;
}
