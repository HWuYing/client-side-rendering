import { __awaiter } from "tslib";
import { lastValueFrom, Subject } from 'rxjs';
const docProxyMethod = ['querySelectorAll', 'getElementById'];
export class ProxySandbox {
    constructor(microManage, staticAssets) {
        this.microManage = microManage;
        this.staticAssets = staticAssets;
        this.loaderStyleSubject = new Subject();
    }
    createShanbox(shadow) {
        const _document = new Proxy(document, this.propProxy(this.docProxy(shadow)));
        const _window = new Proxy(window, this.propProxy({ document: _document }));
        return { window: _window, document: _document };
    }
    linkToStyle(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const href = link.getAttribute('href') || '';
            link.href = URL.createObjectURL(new Blob(['']));
            if (!this.staticAssets.links.includes(href) && href) {
                const text = yield lastValueFrom(this.microManage.la.fetchStatic(href));
                const style = document.createElement('style');
                style.innerText = text;
                this.loaderStyleSubject.next(style);
            }
        });
    }
    appendChild(node) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const name = node.nodeName;
            if (name === 'LINK') {
                yield this.linkToStyle(node);
            }
            return name === 'STYLE' ? (_a = this.loaderStyleSubject) === null || _a === void 0 ? void 0 : _a.next(node) : document.head.append(node);
        });
    }
    docProxy(shadow) {
        const shadowProxy = {};
        const head = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector(`[data-app="head"]`)) || document.head;
        const body = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector(`[data-app="body"]`)) || document.body;
        const _head = new Proxy(head, this.propProxy({ appendChild: this.appendChild.bind(this) }));
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
            get: (target, prop) => proxy[prop] ? proxy[prop] : this.bindMethod(target, prop),
            set: (target, prop, value) => proxy[prop] = value
        };
    }
    bindMethod(target, props) {
        const attr = Reflect.get(target, props);
        return typeof attr === 'function' && !(attr === null || attr === void 0 ? void 0 : attr.prototype) ? (...args) => attr.apply(target, args) : attr;
    }
}
