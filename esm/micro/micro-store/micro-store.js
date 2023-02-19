import { __awaiter } from "tslib";
const FAIL = 'fail';
const SUCCESS = 'success';
export class MicroStore {
    constructor(microName, staticAssets, microManage) {
        var _a;
        this.microName = microName;
        this.staticAssets = staticAssets;
        this.microManage = microManage;
        this.mountedList = [];
        this.loaderStyleNodes = [];
        this.execMountedList = [];
        (_a = this.microManage.loaderStyleSubject) === null || _a === void 0 ? void 0 : _a.subscribe(this.headAppendChildProxy.bind(this));
    }
    onMounted(container, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.execMountedList.push([container, options]);
            if (!this._renderMicro) {
                yield this.loadScriptContext();
            }
            if (this.execMountedList.length === 1) {
                yield this.execMounted();
            }
        });
    }
    unMounted(container) {
        return __awaiter(this, void 0, void 0, function* () {
            const [exMicroInfo] = this.mountedList.filter(({ container: _container }) => container === _container);
            const [execMounted] = this.execMountedList.filter(([_container]) => _container === container);
            if (execMounted) {
                this.execMountedList.splice(this.execMountedList.indexOf(execMounted), 1);
            }
            if (exMicroInfo && exMicroInfo.unRender && exMicroInfo.unMounted !== SUCCESS) {
                yield exMicroInfo.unRender(this.getByContainer(container, 'body'));
                this.mountedList.splice(this.mountedList.indexOf(exMicroInfo), 1);
                exMicroInfo.unMounted = SUCCESS;
            }
            if (exMicroInfo.unMounted !== SUCCESS) {
                exMicroInfo.unMounted = FAIL;
            }
        });
    }
    resetUnMountedFail() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.mountedList.filter((item) => item.unMounted === FAIL).map(({ container }) => this.unMounted(container)));
        });
    }
    execMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const [container, options] = this.execMountedList.shift();
            const mountedItem = { container };
            this.mountedList.push(mountedItem);
            mountedItem.unRender = yield this._renderMicro(this.parseRenderOptions(container, options));
            yield this.resetUnMountedFail();
            this.mountendAppendLoadStyleNode(container);
            this.execMountedList.length !== 0 && (yield this.execMounted());
        });
    }
    execJavascript(execFunctions) {
        const microStore = {};
        const { fetchCacheData } = this.staticAssets;
        execFunctions.forEach((fun) => fun(microStore, fetchCacheData));
        return microStore.render || (() => void (0));
    }
    parseRenderOptions(container, options = {}) {
        const head = this.getByContainer(container, 'head');
        const body = this.getByContainer(container, 'body');
        return Object.assign(Object.assign({}, options), { head, body, microManage: this.microManage });
    }
    headAppendChildProxy(styleNode) {
        if (styleNode.getAttribute('data-micro') === this.microName) {
            Promise.resolve().then(() => this.loaderStyleNodes.push(styleNode.cloneNode(true)));
            this.mountedList.forEach(({ container }) => this.mountendAppendLoadStyleNode(container, [styleNode]));
        }
    }
    mountendAppendLoadStyleNode(container, styleNodes = this.loaderStyleNodes) {
        const styleContainer = this.getByContainer(container, 'head');
        if (styleContainer) {
            styleNodes.forEach((styleNode) => styleContainer.appendChild(styleNode));
        }
    }
    loadScriptContext() {
        return __awaiter(this, void 0, void 0, function* () {
            const { script, js } = this.staticAssets;
            return Promise.all(script.map((source, index) => {
                const hasSourceMap = !/[\S]+\.[\S]+\.js$/.test(js[index]);
                const sourceCode = this.formatSourceCode(source);
                // eslint-disable-next-line no-new-func
                return hasSourceMap ? this.loadBlobScript(sourceCode) : Promise.resolve(new Function('microStore', 'fetchCacheData', sourceCode));
            })).then((execFunctions) => this._renderMicro = this.execJavascript(execFunctions));
        });
    }
    loadBlobScript(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const funName = `${this.microName}${Math.random().toString().replace(/0.([\d]{5})\d*/ig, '$1')}`;
                const script = document.createElement('script');
                script.src = URL.createObjectURL(new Blob([`window.${funName}=function(microStore, fetchCacheData){ ${source}}`]));
                document.body.appendChild(script);
                script.onload = () => resolve(window[funName]);
            });
        });
    }
    getByContainer(container, selector) {
        var _a;
        return (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-app="${selector}"]`);
    }
    formatSourceCode(source) {
        return `${source}\n`;
    }
}
