"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
var tslib_1 = require("tslib");
var application_1 = require("@fm/core/platform/application");
var decorator_1 = require("@fm/core/platform/decorator");
var app_context_1 = require("@fm/core/providers/app-context");
var token_1 = require("@fm/core/token");
var di_1 = require("@fm/di");
var token_2 = require("../token");
var Plugin = /** @class */ (function () {
    function Plugin(ctx, injector) {
        this.ctx = ctx;
        this.injector = injector;
    }
    Plugin.prototype.microLoad = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var importMicro, MicroManage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importMicro = this.injector.get(token_2.IMPORT_MICRO);
                        if (!(importMicro && !this.options.isMicro)) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        MicroManage = (_a.sent()).MicroManage;
                        this.ctx.addProvider({ provide: token_2.IMPORT_MICRO, useExisting: MicroManage });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Plugin.prototype.interceptHistory = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var history, _a, _b, _c, sharedData, historyKey, sharedHistory;
            return tslib_1.__generator(this, function (_d) {
                history = this.injector.get(token_1.HISTORY);
                _a = this.injector.get(app_context_1.AppContextService).microManage, _b = _a === void 0 ? {} : _a, _c = _b.sharedData, sharedData = _c === void 0 ? void (0) : _c;
                if (history && sharedData) {
                    historyKey = token_1.HISTORY.toString();
                    sharedHistory = sharedData.get(historyKey) || history;
                    sharedData.set(historyKey, sharedHistory);
                    this.ctx.addProvider({ provide: token_1.HISTORY, useValue: sharedHistory });
                }
                return [2 /*return*/];
            });
        });
    };
    Plugin.prototype.register = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.microLoad()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.interceptHistory()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        (0, di_1.Inject)(token_1.PlatformOptions),
        tslib_1.__metadata("design:type", Object)
    ], Plugin.prototype, "options", void 0);
    Plugin = tslib_1.__decorate([
        (0, decorator_1.ApplicationPlugin)(),
        tslib_1.__metadata("design:paramtypes", [application_1.ApplicationContext, di_1.Injector])
    ], Plugin);
    return Plugin;
}());
exports.Plugin = Plugin;
