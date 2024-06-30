import { __awaiter, __decorate, __generator, __metadata } from "tslib";
import { ApplicationContext } from '@fm/core/platform';
import { ApplicationPlugin } from '@fm/core/platform/decorator';
import { AppContextService } from '@fm/core/providers/app-context';
import { HISTORY, PlatformOptions } from '@fm/core/token';
import { Inject, Injector } from '@fm/di';
import { IMPORT_MICRO } from '../token';
var Plugin = /** @class */ (function () {
    function Plugin(ctx, injector) {
        this.ctx = ctx;
        this.injector = injector;
    }
    Plugin.prototype.microLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var importMicro, MicroManage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importMicro = this.injector.get(IMPORT_MICRO);
                        if (!(importMicro && !this.options.isMicro)) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro()];
                    case 1:
                        MicroManage = (_a.sent()).MicroManage;
                        this.ctx.addProvider({ provide: IMPORT_MICRO, useExisting: MicroManage });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Plugin.prototype.interceptHistory = function () {
        var history = this.injector.get(HISTORY);
        var _a = this.injector.get(AppContextService).microManage, _b = _a === void 0 ? {} : _a, _c = _b.sharedData, sharedData = _c === void 0 ? void (0) : _c;
        if (history && sharedData) {
            var historyKey = HISTORY.toString();
            var sharedHistory = sharedData.get(historyKey);
            if (!sharedHistory)
                sharedData.set(historyKey, history);
            else if (history !== sharedHistory)
                this.ctx.addProvider({ provide: HISTORY, useValue: sharedHistory });
        }
    };
    Plugin.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.microLoad()];
                    case 1:
                        _a.sent();
                        this.interceptHistory();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Inject(PlatformOptions),
        __metadata("design:type", Object)
    ], Plugin.prototype, "options", void 0);
    Plugin = __decorate([
        ApplicationPlugin(),
        __metadata("design:paramtypes", [ApplicationContext, Injector])
    ], Plugin);
    return Plugin;
}());
export { Plugin };
