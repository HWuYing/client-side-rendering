export class MicroStore {
    microName;
    staticAssets;
    microManage;
    mountedList = [];
    loaderStyleNodes = [];
    execMountedList = [];
    _renderMicro;
    constructor(microName, staticAssets, microManage) {
        this.microName = microName;
        this.staticAssets = staticAssets;
        this.microManage = microManage;
        this.microManage.loaderStyleSubject?.subscribe(this.headAppendChildProxy.bind(this));
    }
    async onMounted(container, options) {
        this.execMountedList.push([container, options]);
        if (!this._renderMicro) {
            await this.loadScriptContext();
        }
        if (this.execMountedList.length === 1) {
            await this.execMounted();
        }
    }
    async unMounted(container) {
        const [exMicroInfo] = this.mountedList.filter(({ container: _container }) => container === _container);
        if (exMicroInfo) {
            this.mountedList.splice(this.mountedList.indexOf(exMicroInfo), 1);
            exMicroInfo.unRender && await exMicroInfo.unRender(container.shadowRoot?.querySelector('[data-app="body"]'));
        }
    }
    async execMounted() {
        const [container, options] = this.execMountedList.shift();
        const unRender = await this._renderMicro(this.parseRenderOptions(container, options));
        this.mountendAppendLoadStyleNode(container);
        this.mountedList.push({ unRender, container });
        if (this.execMountedList.length !== 0) {
            await this.execMounted();
        }
    }
    execJavascript(execFunctions) {
        const { fetchCacheData } = this.staticAssets;
        const microStore = { render: () => void (0) };
        execFunctions.forEach((fun) => fun(microStore, fetchCacheData));
        return microStore.render;
    }
    parseRenderOptions(container, options = {}) {
        const head = container.shadowRoot?.querySelector('[data-app="head"]');
        const body = container.shadowRoot?.querySelector('[data-app="body"]');
        return { ...options, head, body, microManage: this.microManage };
    }
    headAppendChildProxy(styleNode) {
        if (styleNode.getAttribute('data-micro') === this.microName) {
            this.loaderStyleNodes.push(styleNode);
            this.mountedList.forEach(({ container }) => this.mountendAppendLoadStyleNode(container, [styleNode]));
        }
    }
    mountendAppendLoadStyleNode(container, styleNodes = this.loaderStyleNodes) {
        const styleContainer = container.shadowRoot?.querySelector('[data-app="head"]');
        if (styleContainer) {
            styleNodes.forEach((styleNode) => styleContainer.appendChild(styleNode.cloneNode(true)));
        }
    }
    async loadScriptContext() {
        const { script, js } = this.staticAssets;
        return Promise.all(script.map((source, index) => {
            const hasSourceMap = !/[\S]+\.[\S]+\.js$/.test(js[index]);
            const sourceCode = this.formatSourceCode(source);
            // eslint-disable-next-line no-new-func
            return hasSourceMap ? this.loadBlobScript(sourceCode) : Promise.resolve(new Function('microStore', 'fetchCacheData', sourceCode));
        })).then((execFunctions) => this._renderMicro = this.execJavascript(execFunctions));
    }
    async loadBlobScript(source) {
        return new Promise(resolve => {
            const funName = `${this.microManage}${Math.random().toString().replace(/0.([\d]{5})\d*/ig, '$1')}`;
            const script = document.createElement('script');
            script.src = URL.createObjectURL(new Blob([`window.${funName}=function(microStore, fetchCacheData){ ${source}}`]));
            document.body.appendChild(script);
            script.onload = () => resolve(window[funName]);
        });
    }
    formatSourceCode(source) {
        return `${source}\n`;
    }
}
