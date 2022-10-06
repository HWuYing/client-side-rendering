import { __awaiter } from "tslib";
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [exMicroInfo] = this.mountedList.filter(({ container: _container }) => container === _container);
            if (exMicroInfo) {
                this.mountedList.splice(this.mountedList.indexOf(exMicroInfo), 1);
                exMicroInfo.unRender && (yield exMicroInfo.unRender((_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="body"]')));
            }
        });
    }
    execMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const [container, options] = this.execMountedList.shift();
            const unRender = yield this._renderMicro(this.parseRenderOptions(container, options));
            this.mountendAppendLoadStyleNode(container);
            this.mountedList.push({ unRender, container });
            if (this.execMountedList.length !== 0) {
                yield this.execMounted();
            }
        });
    }
    execJavascript(execFunctions) {
        const { fetchCacheData } = this.staticAssets;
        const microStore = { render: () => void (0) };
        execFunctions.forEach((fun) => fun(microStore, fetchCacheData));
        return microStore.render;
    }
    parseRenderOptions(container, options = {}) {
        var _a, _b;
        const head = (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="head"]');
        const body = (_b = container.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('[data-app="body"]');
        return Object.assign(Object.assign({}, options), { head, body, microManage: this.microManage });
    }
    headAppendChildProxy(styleNode) {
        if (styleNode.getAttribute('data-micro') === this.microName) {
            this.loaderStyleNodes.push(styleNode);
            this.mountedList.forEach(({ container }) => this.mountendAppendLoadStyleNode(container, [styleNode]));
        }
    }
    mountendAppendLoadStyleNode(container, styleNodes = this.loaderStyleNodes) {
        var _a;
        const styleContainer = (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('[data-app="head"]');
        if (styleContainer) {
            styleNodes.forEach((styleNode) => styleContainer.appendChild(styleNode.cloneNode(true)));
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
                const funName = `${this.microManage}${Math.random().toString().replace(/0.([\d]{5})\d*/ig, '$1')}`;
                const script = document.createElement('script');
                script.src = URL.createObjectURL(new Blob([`window.${funName}=function(microStore, fetchCacheData){ ${source}}`]));
                document.body.appendChild(script);
                script.onload = () => resolve(window[funName]);
            });
        });
    }
    formatSourceCode(source) {
        return `${source}\n`;
    }
}
