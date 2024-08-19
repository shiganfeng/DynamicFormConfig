import utils from "@/utils/utils.js";

export function setCache(key, data) {
    window.sessionStorage.setItem(key, data);
}

export function getCache(key) {
    return window.sessionStorage.getItem(key);
}

export function removeCache(key) {
    return window.sessionStorage.removeItem(key);
}

export class MyCache {
    cache = {}
    key = ''
    constructor(key, data) {
        this.key = key;
        this.cache = {
            data: data
        };
        this.recover();
        this.removeBackup();
        this._onpagehide = this._onpagehide.bind(this);
        window.addEventListener('pagehide', this._onpagehide, false);
    }
    backup() {
        setCache(this.key, JSON.stringify(this.cache.data || {}));
    }
    recover() {
        utils.assign(this.cache.data, JSON.parse(getCache(this.key) || "{}"))
    }
    removeBackup() {
        removeCache(this.key);
    }
    _onpagehide() {
        this.backup();
    }
    clearEffect() {
        window.removeEventListener('pagehide', this._onpagehide, false);
    }
}