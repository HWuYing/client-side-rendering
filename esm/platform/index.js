import { __awaiter, __rest } from "tslib";
import { HttpHandler, HttpInterceptingHandler } from '@hwy-fm/core/common/http';
import { APP_CONTEXT, AppContextService } from '@hwy-fm/core/providers/app-context';
import { JsonConfigService } from '@hwy-fm/core/providers/json-config';
import { APPLICATION_TOKEN, HTTP_INTERCEPTORS } from '@hwy-fm/core/token';
import { Injector } from '@hwy-fm/di';
import { AppContextService as ClientAppContextService } from '../providers/app-context';
import { JsonConfigService as ClientJsonConfigService, JsonIntercept } from '../providers/json-config';
import { IMPORT_MICRO } from '../token';
export class Platform {
    constructor(platformInjector, { isMicro, resource }) {
        this.platformInjector = platformInjector;
        this.resource = resource;
        this.isMicro = isMicro;
    }
    bootstrapRender(providers) {
        return __awaiter(this, void 0, void 0, function* () {
            const injector = this.beforeBootstrapRender({ useMicroManage: () => injector.get(IMPORT_MICRO) }, providers);
            yield this.runRender(injector, undefined);
        });
    }
    bootstrapMicroRender(providers, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { microManage, head, body } = options, _options = __rest(options, ["microManage", "head", "body"]);
            const microConfig = { container: body, styleContainer: head, useMicroManage: () => microManage };
            const injector = this.beforeBootstrapRender(microConfig, providers);
            const unRender = yield this.runRender(injector, _options);
            return (_container) => {
                unRender(_container);
                injector.destroy();
                this.platformInjector.destroy();
            };
        });
    }
    beforeBootstrapRender(context = {}, providers = []) {
        const container = context.container || document.getElementById('app');
        const styleContainer = document.head;
        const renderSSR = !!(container === null || container === void 0 ? void 0 : container.innerHTML);
        const appContext = Object.assign({ container, styleContainer, renderSSR, resource: this.resource, isMicro: this.isMicro }, context);
        const additionalProviders = [
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ClientJsonConfigService },
            { provide: AppContextService, useExisting: ClientAppContextService },
            { provide: HTTP_INTERCEPTORS, multi: true, useExisting: JsonIntercept },
            providers
        ];
        return Injector.create(additionalProviders, this.platformInjector);
    }
    runRender(injector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const application = yield injector.get(APPLICATION_TOKEN);
            return (_a = application.main) === null || _a === void 0 ? void 0 : _a.call(application, injector, options);
        });
    }
}
