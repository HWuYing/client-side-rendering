import { MICRO_OPTIONS } from '@fm/shared/token';
import { microOptions } from '../micro-options';
export var registryMicro = function (injector) {
    var providers = [{ provide: MICRO_OPTIONS, useValue: microOptions }];
    providers.forEach(function (provider) { return injector.set(provider.provide, provider); });
};
export { MicroManage } from '../micro-manage/micro-manage';
