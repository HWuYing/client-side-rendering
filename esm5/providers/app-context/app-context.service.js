import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
let AppContextService = class AppContextService extends SharedAppContextService {
};
AppContextService = __decorate([
    Injectable()
], AppContextService);
export { AppContextService };
