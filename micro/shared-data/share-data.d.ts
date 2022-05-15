import { SharedDataInterface } from '@fm/shared/micro/types';
export declare class SharedData implements SharedDataInterface {
    private data;
    set(key: string, value: any): void;
    get<T>(key: string): T;
}
