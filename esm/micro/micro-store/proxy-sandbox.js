import { __awaiter } from "tslib";
import { isUndefined } from 'lodash';
import { lastValueFrom, shareReplay, Subject } from 'rxjs';
const docProxyMethod = ['querySelectorAll', 'getElementById'];
export class ProxySandbox {
    constructor(microManage, staticAssets) {
        this.microManage = microManage;
        this.staticAssets = staticAssets;
        this.cache = new Map();
        this.loaderStyleSubject = new Subject();
        this.loaderScriptSubject = new Subject();
    }
    createShadowbox(shadow) {
        const shadBox = {};
        const _document = new Proxy(document, this.propProxy(this.docProxy(shadBox, shadow)));
        const _window = new Proxy(window, this.propProxy({ document: _document }));
        return Object.assign(shadBox, { window: _window, self: _window, global: _window, document: _document });
    }
    linkToStyle(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const href = link.getAttribute('href') || '';
            if (!this.staticAssets.links.includes(href) && href) {
                this.staticAssets.links.push(href);
                const style = document.createElement('style');
                style.innerText = yield lastValueFrom(this.microManage.la.fetchStatic(href));
                this.loaderStyleSubject.next(style);
            }
            link.setAttribute('proxy-href', href);
            link.href = URL.createObjectURL(new Blob(['']));
        });
    }
    srcToScript(shadBox, node) {
        return __awaiter(this, void 0, void 0, function* () {
            const src = node.getAttribute('src') || '';
            let subject = this.cache.get(src);
            if (!subject) {
                subject = this.microManage.la.fetchStatic(src).pipe(shareReplay(1));
                this.cache.set(src, subject);
            }
            const text = yield lastValueFrom(subject);
            node.src = URL.createObjectURL(new Blob(['']));
            this.loaderScriptSubject.next([{ script: [text], js: [src] }, shadBox, () => document.head.append(node)]);
        });
    }
    appendChild(shadBox, node) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const name = node.nodeName;
            if (name === 'LINK') {
                yield this.linkToStyle(node);
            }
            if (name === 'SCRIPT') {
                return yield this.srcToScript(shadBox, node);
            }
            return name === 'STYLE' ? (_a = this.loaderStyleSubject) === null || _a === void 0 ? void 0 : _a.next(node) : document.head.append(node);
        });
    }
    docProxy(shadBox, shadow) {
        const shadowProxy = {};
        const head = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector(`[data-app="head"]`)) || document.head;
        const body = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector(`[data-app="body"]`)) || document.body;
        const _head = new Proxy(head, this.propProxy({ appendChild: this.appendChild.bind(this, shadBox) }));
        const querySelector = this.querySelector(_head, body, shadow);
        shadow && docProxyMethod.forEach((key) => {
            const method = shadow[key];
            shadowProxy[key] = (...args) => method.apply(shadow, args);
        });
        return Object.assign(Object.assign({ body, head: _head }, shadowProxy), { querySelector });
    }
    querySelector(head, body, shadow = document) {
        const regExp = /^(styleLoaderInsert:[^:]+::shadow|head)$/g;
        return (selectors) => {
            if (regExp.test(selectors))
                return head;
            if (selectors === 'body')
                return body;
            return shadow.querySelector(selectors);
        };
    }
    propProxy(proxy) {
        return {
            get: (target, prop) => !isUndefined(proxy[prop]) ? proxy[prop] : this.bindMethod(target, prop),
            set: (target, prop, value) => Reflect.set(target, prop, value)
        };
    }
    bindMethod(target, props) {
        const attr = Reflect.get(target, props);
        return typeof attr === 'function' && !(attr === null || attr === void 0 ? void 0 : attr.prototype) ? attr.bind(target) : attr;
    }
}
