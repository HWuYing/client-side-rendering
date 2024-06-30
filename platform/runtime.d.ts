import './plugin.effects';
export { PLATFORM_SCOPE } from '@fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@fm/core/platform/decorator';
export declare const Application: (metadata?: import("../../di").Type<import("../../core/platform/decorator").MetadataInfo> | {
    [key: string]: any;
}) => ClassDecorator;
