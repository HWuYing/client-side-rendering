import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
var AppContextService = /** @class */ (function (_super) {
    __extends(AppContextService, _super);
    function AppContextService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppContextService = __decorate([
        Injectable()
    ], AppContextService);
    return AppContextService;
}(SharedAppContextService));
export { AppContextService };
