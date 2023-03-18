import { __awaiter } from "tslib";
import { ProxySandbox } from './proxy-sandbox';
const FAIL = 'fail';
const SUCCESS = 'success';
export class MicroStore {
    constructor(microName, staticAssets, microManage) {
        this.microName = microName;
        this.staticAssets = staticAssets;
        this.microManage = microManage;
        this.mountedList = [];
        this.loaderStyleNodes = [];
        this.execMountedList = [];
        this.proxySandbox = new ProxySandbox(microManage, staticAssets);
        this.proxySandbox.loaderScriptSubject.subscribe(this.loadScriptContext.bind(this));
        this.proxySandbox.loaderStyleSubject.subscribe(this.headAppendChildProxy.bind(this));
    }
    onMounted(container, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { selfScope } = options;
            this.execMountedList.push([container, options]);
            if (selfScope || !this._renderMicro) {
                const shadBox = this.proxySandbox.createShanbox(selfScope && container.shadowRoot);
                this._renderMicro = yield this.loadScriptContext([this.staticAssets, shadBox]);
            }
            if (selfScope || this.execMountedList.length === 1) {
                yield this.execMounted(this._renderMicro);
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
            if (exMicroInfo && exMicroInfo.unMounted !== SUCCESS) {
                exMicroInfo.unMounted = FAIL;
            }
            if (!exMicroInfo) {
                console.info('The node has no service attached or has been removed', container);
            }
        });
    }
    resetUnMountedFail() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.mountedList.filter((item) => item.unMounted === FAIL).map(({ container }) => this.unMounted(container)));
        });
    }
    execMounted(_renderMicro = this._renderMicro) {
        return __awaiter(this, void 0, void 0, function* () {
            const [container, options] = this.execMountedList.shift();
            const mountedItem = { container };
            this.mountedList.push(mountedItem);
            mountedItem.unRender = yield _renderMicro(this.parseRenderOptions(container, options));
            yield this.resetUnMountedFail();
            this.mountendAppendLoadStyleNode(container);
            this.execMountedList.length !== 0 && (yield this.execMounted(_renderMicro));
        });
    }
    execJavascript(execFunctions, shadBox = {}) {
        const microStore = { microName: this.microName };
        const { fetchCacheData } = this.staticAssets;
        execFunctions.forEach((fun) => fun(shadBox, microStore, fetchCacheData));
        return microStore.render || (() => void (0));
    }
    parseRenderOptions(container, options = {}) {
        const head = this.getByContainer(container, 'head');
        const body = this.getByContainer(container, 'body');
        return Object.assign(Object.assign({}, options), { shadow: container, head, body, microManage: this.microManage });
    }
    headAppendChildProxy(styleNode) {
        Promise.resolve().then(() => this.loaderStyleNodes.push(styleNode.cloneNode(true)));
        this.mountedList.forEach(({ container }) => this.mountendAppendLoadStyleNode(container, [styleNode]));
    }
    mountendAppendLoadStyleNode(container, styleNodes = this.loaderStyleNodes) {
        const styleContainer = this.getByContainer(container, 'head');
        if (styleContainer) {
            styleNodes.forEach((styleNode) => styleContainer.appendChild(styleNode));
        }
    }
    loadScriptContext([staticAssets, shadBox]) {
        return __awaiter(this, void 0, void 0, function* () {
            const { script, js } = staticAssets;
            return Promise.all(script.map((source, index) => {
                const hasSourceMap = !/[\S]+\.[\S]+\.js$/.test(js[index]);
                const sourceCode = this.formatSourceCode(source, shadBox);
                return hasSourceMap ? this.loadBlobScript(sourceCode) : Promise.resolve(
                // eslint-disable-next-line no-new-func
                new Function('shadBox', 'microStore', 'fetchCacheData', sourceCode));
            })).then((execFunctions) => this.execJavascript(execFunctions, shadBox));
        });
    }
    loadBlobScript(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const global = window;
                const funName = `${this.microName}${Math.random().toString().replace(/0.([\d]{5})\d*/ig, '$1')}`;
                const script = document.createElement('script');
                script.src = URL.createObjectURL(new Blob([`window.${funName}=function(shadBox, microStore, fetchCacheData){ ${source}}`]));
                document.body.appendChild(script);
                script.onload = () => (resolve(global[funName]), delete global[funName]);
            });
        });
    }
    getByContainer(container, selector) {
        var _a;
        return (_a = container.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-app="${selector}"]`);
    }
    formatSourceCode(source, shadBox) {
        return `${Object.keys(shadBox).map((k) => `var ${k}=shadBox.${k};`).join('')}${source}\n`;
    }
}
