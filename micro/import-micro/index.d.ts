export declare const registryMicro: () => {
    provide: import("../../../di").InjectorToken;
    useValue: {
        assetsPath: (microName: string) => string;
    };
}[];
export { MicroManage } from '../micro-manage/micro-manage';
