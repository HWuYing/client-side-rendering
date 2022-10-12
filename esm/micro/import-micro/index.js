import { MICRO_OPTIONS } from '@fm/shared';
import { microOptions } from '../micro-options';
export const registryMicro = (injector) => {
    const providers = [{ provide: MICRO_OPTIONS, useValue: microOptions }];
    providers.forEach((provider) => injector.set(provider.provide, provider));
};
export { MicroManage } from '../micro-manage/micro-manage';
