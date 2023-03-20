import { SharedDataInterface } from '@fm/core/micro';
export declare class SharedData implements SharedDataInterface {
    private data;
    set(key: string, value: any): void;
    get<T>(key: string): T;
}
