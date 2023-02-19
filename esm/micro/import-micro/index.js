import { MICRO_OPTIONS } from '@fm/shared';
import { microOptions } from '../micro-options';
export const registryMicro = () => [{ provide: MICRO_OPTIONS, useValue: microOptions }];
export { MicroManage } from '../micro-manage/micro-manage';
