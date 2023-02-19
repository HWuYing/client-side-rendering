import { MICRO_OPTIONS } from '@fm/shared';
import { microOptions } from '../micro-options';
export var registryMicro = function () { return [{ provide: MICRO_OPTIONS, useValue: microOptions }]; };
export { MicroManage } from '../micro-manage/micro-manage';
