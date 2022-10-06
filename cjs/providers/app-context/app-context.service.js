"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var app_context_1 = require("@fm/shared/providers/app-context");
var AppContextService = /** @class */ (function (_super) {
    tslib_1.__extends(AppContextService, _super);
    function AppContextService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppContextService = tslib_1.__decorate([
        (0, di_1.Injectable)()
    ], AppContextService);
    return AppContextService;
}(app_context_1.AppContextService));
exports.AppContextService = AppContextService;
