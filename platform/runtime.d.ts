import './plugin.effects';
export { PLATFORM_SCOPE } from '@hwy-fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@hwy-fm/core/platform/decorator';
export declare const Application: (metadata?: import("../../di").Type<import("../../core/platform/decorator").MetadataInfo> | {
    [key: string]: any;
}) => ClassDecorator;
