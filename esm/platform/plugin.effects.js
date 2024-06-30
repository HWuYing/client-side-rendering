import { __awaiter, __decorate, __metadata } from "tslib";
import { ApplicationContext } from '@fm/core/platform';
import { ApplicationPlugin } from '@fm/core/platform/decorator';
import { AppContextService } from '@fm/core/providers/app-context';
import { HISTORY, PlatformOptions } from '@fm/core/token';
import { Inject, Injector } from '@fm/di';
import { IMPORT_MICRO } from '../token';
let Plugin = class Plugin {
    constructor(ctx, injector) {
        this.ctx = ctx;
        this.injector = injector;
    }
    microLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const importMicro = this.injector.get(IMPORT_MICRO);
            if (importMicro && !this.options.isMicro) {
                const { MicroManage } = yield importMicro();
                this.ctx.addProvider({ provide: IMPORT_MICRO, useExisting: MicroManage });
            }
        });
    }
    interceptHistory() {
        const history = this.injector.get(HISTORY);
        const { microManage: { sharedData = void (0) } = {} } = this.injector.get(AppContextService);
        if (history && sharedData) {
            const historyKey = HISTORY.toString();
            const sharedHistory = sharedData.get(historyKey);
            if (!sharedHistory)
                sharedData.set(historyKey, history);
            else if (history !== sharedHistory)
                this.ctx.addProvider({ provide: HISTORY, useValue: sharedHistory });
        }
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.microLoad();
            this.interceptHistory();
        });
    }
};
__decorate([
    Inject(PlatformOptions),
    __metadata("design:type", Object)
], Plugin.prototype, "options", void 0);
Plugin = __decorate([
    ApplicationPlugin(),
    __metadata("design:paramtypes", [ApplicationContext, Injector])
], Plugin);
export { Plugin };
