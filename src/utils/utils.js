import { deepLoop } from "./deepLoop.js";
// 全局特殊工具
(function() {
    /**
     * @description 创建私有化防抖工具
     * @param delay { Number } 防抖间隔时间
     * @return function @param handler 需要执行函数
     *
     * */
    window.createDebounce = function(delay = 150) {
        let timer = null;
        return function(handler) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                handler instanceof Function && handler();
            }, delay);
        }
    };
}());
const toStr = Object.prototype.toString;
const utils = {
    /**
     * @description 根据路径取值。
     * @param data { Object }
     * @param keyPath { String, Array<String> }
     * @param keyPathSep { String }
     *
     * @return { any }
     * */
    getValue: (function() {
        const empty = new Set([null, undefined]);
        return function(data = {}, keyPath = '', keyPathSep = '.') {
            let keys = [];
            const keyPathType = toStr.call(keyPath).slice(8, -1).toLowerCase();
            if (keyPathType === 'string') {
                keys = keyPath.split(keyPathSep);
            } else if (keyPathType === 'array') {
                keys = Array.from(keyPath);
            } else {
                throw new TypeError(`keyPath 期望值类型 string 或 array，但得到 ${keyPathType}`);
            }
            let value;
            const len = keys.length;

            for (let i = 0; i < len; i++) {
                const key = keys[i];
                value = data[key];
                data = data[key];
                if (empty.has(value)) {
                    break;
                }
            }
            return value;
        };
    })(),
    // 通过class找到拥有此class类名的父或祖先元素，如果自身有此类名则返回自身
    useClassGetParent (el, parentClassName = '') {
        if (!el || el === document.body || !parentClassName) return null;
        if (typeof parentClassName === 'object') {
            if (el === parentClassName) return el;
            return utils.useClassGetParent(el.parentNode || el.parentElement, parentClassName);
        } else if (typeof parentClassName === 'string') {
            if ([...el.classList].includes(parentClassName)) return el;
            return utils.useClassGetParent(el.parentNode || el.parentElement, parentClassName);
        }
    },
    isPointer(data) {
        const type = typeof data;
        return data !== null && type === 'object';
    },
    // 深度克隆，有时对象里存储无法被序列化的数据时需要用到。例如：files
    deepClone(origin, target) {
        target = target || Array.isArray(origin) ? [] : {};

        const transferList = [
            [target, origin]
        ];
        while (transferList.length) {
            const [[targetData, data]] = transferList.splice(0, 1);
            const dataKeys = Object.keys(data);
            for (const dataKey of dataKeys) {
                if (utils.isPointer(data[dataKey])) {
                    const item = Array.isArray(data[dataKey]) ? [] : {};
                    targetData[dataKey] = item;
                    transferList.push([item, data[dataKey]]);
                } else {
                    targetData[dataKey] = data[dataKey];
                }
            }
        }
        return target;
    },
    /**
     * @description 深度版本的 Object.assign
     * */
    assign(target, ...residueObjs) {
        while (residueObjs.length) {
            const [residueObj] = residueObjs.splice(0, 1);
            const transferList = [
                [target, residueObj]
            ];
            while (transferList.length) {
                const [[targetData, data]] = transferList.splice(0, 1);
                const dataKeys = Object.keys(data);
                for (const dataKey of dataKeys) {
                    if (utils.isPointer(data[dataKey])) {
                        if (utils.isPointer(targetData[dataKey])) {
                            transferList.push([targetData[dataKey], data[dataKey]]);
                        } else {
                            targetData[dataKey] = utils.deepClone(data[dataKey]);
                        }
                    } else {
                        targetData[dataKey] = data[dataKey];
                    }
                }
            }
        }
        return target;
    },
    // 检测数据类型
    type(o) {
        return toStr.call(o).slice(8, -1).toLowerCase();
    },
    /**
     * @description 把数组 array<objectItem> 根据指定 objectItem 中的指定属性，生成一个 对象并返回。
     * @param array { Array<Object> }
     * @param keyNames { Array<String> } 数组项 中包含的属性名。
     * @param childrenKey { String } 树形数据的子项 key 名。
     * @return { Array<Object> }
     *
     * @example
     * var arr = [
     *     { id: 'xxx', name: 'x' },
     *     { id: 'yyy', name: 'y' },
     * ];
     * var arrayMap = createMap(arr, ['id', 'name']);
     * [
     *     {
     *         xxx: { id: 'xxx', name: 'x' },
     *         yyy: { id: 'yyy', name: 'y' },
     *     },
     *    {
     *         x: { id: 'xxx', name: 'x' },
     *         y: { id: 'yyy', name: 'y' },
     *     },
     * ]
     * */
    createMap(array, keyNames = [], childrenKey = 'children') {
        const mapList = keyNames.map(() => {
            return {};
        });
        const flagArr = Array.from(array);
        while (flagArr.length) {
            // 拿到flagArr的第一个元素
            const currentItem = flagArr.shift();
            for (let k = 0; k < keyNames.length; k++) {
                const keyName = keyNames[k];
                const map = mapList[k];
                // 以keyName为key，currentItem为value形成对象
                map[currentItem[keyName]] = currentItem;
            }
            const children = currentItem[childrenKey] || [];
            flagArr.push(...children);
        }
        return mapList;
    },
    /**
     * @description 获取随机值
     * @param min { Number } 最小值，结果包含最小值
     * @param max { Number } 最大值，结果不包含最大值
     * @return { Number }
     * */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    /**
     * @description 理论px值 转换为 实际px值。
     * @param theoryPx { Number } 理论px值
     * @return { Number } 实际px值
     * */
    theoryPxToPracticalPx(theoryPx) {
        return window.innerWidth / 1920 * theoryPx;
    },
    // 获取元素四个边距离可视区的距离，以及宽高属性(宽高包含Border)
    getEleRect(ele) {
        const rect = ele.getBoundingClientRect();
        // 老版本ie未实现width和height
        rect.width = rect.right - rect.left;
        // 老版本ie未实现width和height
        rect.height = rect.bottom - rect.top;
        return rect
    },
    // 获取可视窗口宽高
    getViewportOffset() {
        if (window.innerWidth) {
            return {
                w: window.innerWidth,
                h: window.innerHeight
            }
        } else {
            // 混杂模式
            if (document.compatMode === 'BackCompat') {
                return {
                    w: document.body.clientWidth,
                    h: document.body.clientHeight
                }
            } else {
                // "CSS1Compat"标准模式
                return {
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight
                }
            }
        }
    },
    // 获取元素 离body或第一个有定位元素的parent 的距离
    getElementPosition(ele, isGetParentPosition = false) {
        let left = 0;
        let top = 0;
        function a(ele) {
            left += ele.offsetLeft;
            top += ele.offsetTop;
            if (isGetParentPosition) {
                // 获取离第一个有定位元素的parent 的距离
                if (ele.offsetParent !== null) {return}
            } else {
                // 获取元素离body的距离
                if (ele.offsetParent === null || ele.offsetParent === document.body) {return}
            }
            a(ele.offsetParent);
        }
        a(ele);
        return {
            left,
            top
        }
    },
    // 判断元素整体是否在在屏幕中可见
    isTopVisible(ele) {
        const { h } = utils.getViewportOffset();
        const { top, height } = utils.getEleRect(ele);
        return (top + height) > 0 && top < h;
    },
    // 判断元素是否在其父容器中 是否是top可见元素
    isParentFirstVisible(ele) {
        const pN = ele.parentNode || ele.parentElement;
        const { top: pNOffsetTop } = utils.getEleRect(pN);
        const { height: pNHeight } = utils.getEleRect(pN);
        const { top } = utils.getEleRect(ele);
        const realTop = top - pNOffsetTop;
        return (realTop) >= 0 && realTop <= pNHeight;
    },
    /**
     * @description 验证一个对象所有自有属性是不是都有值
     * @param data { Object }
     * @return { Boolean }
     * */
    verifyPropEmpty(data) {
        const tempArr = Object.keys(data);
        return tempArr.every((p) => {
            return data[p]
        });
    },
    // 比较出最小值和最大值的，item对象 在数组中的下标
    compare(arr, key) {
        const temp = [];
        const n = Object.keys(arr).length;
        for(let i = 0; i < n; i ++) {
            temp.push(parseFloat(arr[i][key]));
        }
        const min = Math.min(...temp);
        const max = Math.max(...temp);
        return {
            min: arr.findIndex(o => parseFloat(o[key]) === min),
            max: arr.findIndex(o => parseFloat(o[key]) === max)
        }
    },
    // 计算结果
    computeRes(v1, v2, method) {
        switch (method) {
            case '+': {
                return parseFloat(v1) + parseFloat(v2);
            }
            case '-': {
                return parseFloat(v1) - parseFloat(v2);
            }
            case '*': {
                return parseFloat(v1) * parseFloat(v2);
            }
            case '/': {
                return parseFloat(v1) / parseFloat(v2);
            }
            case '%': {
                return parseFloat(v1) % parseFloat(v2);
            }
        }
    },
    // 检测是否是JSON字符串
    isJSONStr(str = '') {
        if (typeof(str) !== 'string') {
            return false;
        }
        return (str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'));
    },
    // 获取base64图片地址，接收参数  file实例
    createBase64(file) {
        return new Promise((resolve) => {
            const render = new FileReader();
            render.onload = function () {
                resolve(this.result);
            };
            render.onerror = function () {
                resolve('');
            };
            render.readAsDataURL(file);
        })
    },
    /**
     * @description 批量替换字符串
     *
     * @param str { String } 目标字符串
     * @param rules { Array } 替换规则，
     * @desc rules内项是包含着 reg和value 两个属性的对象，reg：替换规则正则，value：是用来替换的值
     *
     * @return String 返回的最终结果字符串
     * */
    batchReplace(str, rules = []) {
        for (let i of rules) {
            str = str.replace(i.reg, i.value || '');
        }
        return str;
    },
    /**
     * @description 指定保留几位小数，如非小数，则不变（内置toFixed，如果非小数，则添加指定位数个0）
     *
     * @param num { String|Number } 需要转换的数字
     * @param retain { Number } 保留几位小数
     *
     * @return Number
     * */
    toFixed(num, retain = 2) {
        num = num * 1;
        return parseFloat(num.toFixed(retain));
    },

    /**
     * @description 查询入参中是否有 空值
     * @param value { any }
     * @return { Boolean }
     * */
    isEmpty: (() => {
        const empty = new Set(['', null, '-', undefined, NaN, Infinity]);
        return function(value) {
            return empty.has(value);
        }
    })(),
    /**
     * @description 查询入参中是否有 '' | null
     * @param { any } args
     * @return { Boolean }
     * */
    hasEmpty(...args) {
        const isEmpty = utils.isEmpty;
        return !!args.length && args.some(item => isEmpty(item));
    },
    /**
     * @description 数字转换为 n:n
     * @param floatNumber { Number }
     * @param retain { Number } 保留几位小数
     * @return { String }
     * */
    floatToRatio(floatNumber, retain = 1) {
        if (utils.hasEmpty(floatNumber)) {
            return '';
        } else {
            if (floatNumber < 1) {
                return `1:${utils.toFixed(1 / floatNumber, retain)}`;
            } else {
                return `${utils.toFixed(floatNumber, retain)}:1`;
            }
        }
    },
    /**
     * @description 创建检测滚动条函数
     * @param el { HTMLElement } 需要检测的元素
     * @return { Function }
     * */
    createIsScroll(el) {
        const gcs = window.getComputedStyle;
        let h = (gcs ? gcs(el) : el.currentStyle).height.replace('px', '') * 1;
        h = Math.round(h);
        return function () {
            return el.scrollHeight - h > 2;
        }
    },
    /**
     * @description 使元素的滚动条小时，并截取使元素拥有滚动条的多余文本
     * @param el { HTMLElement } 元素
     * @param speed { Number } 截取速度
     * @return { String }
     * */
    clipScrollText: (function () {
        /**
         * 从后往前截取
         * */
        function formBackToFront (el, speed = 1) {
            let target = '';
            const isScroll = utils.createIsScroll(el);
            const originText = el.innerText;
            let n = speed;
            while(n < originText.length && isScroll()) {
                el.innerText = originText.slice(0, -n);
                target = originText.slice(-n);
                n+=speed;
            }
            return target;
        }
        /**
         * 从前往后截取
         * */
        function formFrontToBack (el, speed = 1) {
            const isScroll = utils.createIsScroll(el);
            const originText = el.innerText;
            let end = speed;
            el.innerText = originText.slice(0, end);
            while (!isScroll() && originText.length >= (end - speed)) {
                end+=speed;
                el.innerText = originText.slice(0, end);
            }
            const start = end - speed;

            if (end === speed) {
                return '';
            } else {
                // 恢复正常无滚动条状态的内容
                el.innerText = originText.slice(0, start);
                return originText.slice(start);
            }
        }
        return function (el, speed) {
            const gcs = window.getComputedStyle;
            const h = (gcs ? gcs(el) : el.currentStyle).height.replace('px', '') * 1;
            return el.scrollHeight / Math.round(h) > 2 ? formFrontToBack(el, speed) : formBackToFront(el, speed);
        }
    })(),
    /**
     * @description 生成TableData
     * @type Function
     * @param { String } text
     * @param { { contentWidth: String, contentHeight: String, fontSize: String, lineHeight?: String, fontFamily?: String } } css
     *
     * */
    slicingTextToArray: (() => {
        /**
         * @description 传入文本和{单行格子的css样式}，得出Array<String>
         * @param { { contentWidth: String, contentHeight: String, fontSize: String, lineHeight?: String, fontFamily?: String } } css
         * */
        function getCreateLinesFun(css = {}) {
            const { dom, destroyDom } = (() => {
                const dom = document.createElement('div');
                const id = 'id_' + Math.random().toString().slice(3, 10);
                dom.id = id;
                const style = document.createElement('style');
                // opacity: 0;
                // visibility: hidden;
                style.innerHTML = `
                    #${id} {
                        width: ${css.contentWidth}!important;
                        height: ${css.contentHeight}!important;
                        font-size: ${css.fontSize}!important;
                        line-height: ${css.lineHeight}!important;
                        font-family: ${css.fontFamily || 'inherit'}!important;
                        padding: 0!important;
                        margin: 0!important;
                        box-sizing: border-box!important;
                        overflow-y: auto!important;
                        white-space: pre-wrap!important;
                        word-break: break-all!important;

                        background-color: aqua;
                        position: absolute!important;
                        left: 0!important;
                        top: 0!important;
                        transform: translateX(-101%) translateY(-101%)!important;

                    }
                    #${id}::-webkit-scrollbar {
                        width: 0!important;
                        height: 0!important;
                        background-color: #000;
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(dom);
                return {
                    dom,
                    // 清除DOM。
                    destroyDom() {
                        dom.remove();
                        style.remove();
                    }
                };
            })();

            function _createLines(t = '', target = []) {
                let excessText = t;
                while (excessText) {
                    dom.innerText = excessText;
                    excessText = utils.clipScrollText(dom, 1);
                    target.push(dom.innerText);
                }
                return target;
            }
            function fun (text = '') {
                return _createLines(text);
            }
            fun.destroyDom = destroyDom;
            return fun;
        }
        /**
         * @description 生成TableData
         * @param { String } text
         * @param { { contentWidth: String, contentHeight: String, fontSize: String, lineHeight?: String, fontFamily?: String } } css
         * @example
         * createLines('1111111111111111111111111111111111111', { fontSize: '14px', contentWidth: '120px', contentHeight: '18px' })
         * */
        function createLines(text, css = {}) {
            css.lineHeight = css.lineHeight || css.contentHeight;
            const createLinesFun = getCreateLinesFun(css);
            const lines = createLinesFun(text.trim());
            // 清除DOM
            createLinesFun.destroyDom();
            return lines;
        }
        return createLines;
    })(),
    /**
     * @description 下载文件
     * @param url
     * @param fileName
     * */
    download(url, fileName = '') {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = fileName;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
    },
    /**
     * @description 下载文件
     * @param {Object} response
     * @param {String} fileName
     * */
    downloadFile(response, fileName = '') {
        if (!fileName) {
            const sep = 'filename=';
            const contentDisposition = response.headers['content-disposition'] || '';
            const idx = contentDisposition.indexOf(sep);
            fileName = window.decodeURIComponent(contentDisposition.slice(idx + sep.length));
        }
        const reader = new FileReader();
        reader.onload = e => {
            if (typeof e.target.result === 'string') {
                utils.download(e.target.result, fileName);
            }
        };
        reader.readAsDataURL(response.data);
    },
    /**
     * @description 根据dataIndex获取值
     * @param data { Object } 数据对象
     * @param dataIndex { Object } 取值key地址 可以是以.连接的地址
     *                        userInfo.username
     *                        list.3
     * @return { any };
     * */
    usePathGetData(data, dataIndex) {
        const path = dataIndex.split('.');
        let val = data;
        path.forEach(p => val = val[p]);
        return val;
    },
    /**
     * @param text String 需要被复制到剪切板的文本
     * */
    copyText: (function () {
        const inp = (() => {
            let el = document.querySelector('.temp_copy_textarea');
            if (el) {
                return el;
            } else {
                el = document.createElement('textarea');
                el.className = '.temp_copy_textarea';
                el.style.position = 'fixed';
                el.style.top = '-4000px';
                el.style.left = '-4000px';
                // 可以使用opacity，但会遮挡其它元素。
                el.style.opacity = '0';
                // 不能使用，否则元素将无法获取焦点。
                // el.style.visibility = 'hidden';
                document.body.appendChild(el);
            }
            return el;
        })();
        return async function (text) {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                inp.value = text;
                inp.focus();
                inp.select();
                // 这里为了兼容，所以使用的Beta的包名，而scheme是使用的简约。默认会先找简约。若无  则找Beta，而Beta会使用到剪切板。
                document.execCommand('copy');
                inp.blur();
            }
        }
    })(),
    /**
     * @description 执行打印元素。
     * 注意：被打印元素 targetEl 及 targetEl后代元素 的样式不能依赖 targetEl 的祖先元素。
     *      ✔：.target {...style}
     *      ❌：.parent .target {...style}
     *      ✔：.target .text {...style}
     *      ❌：.parent .text {...style}
     * @param el { HTMLElement } 需要打印的元素
     * @param ?options {
     *      testing: Boolean 是否是测试状态，默认值 false。测试状态不会清除 副作用，并且会返回一个 用于清除副作用的函数。
     *      inBody: Boolean 是否把元素放入到 body 中打印。默认值 false，会把元素放入到 html 元素内。
     *  }
     *  @example
     *  printNode(document.querySelector('#target'));
     * */
    printNode: (function () {
        function createStyle(css) {
            const style = document.createElement('style');
            style.innerText = css;
            return style;
        }

        function getHideClass() {
            return 'hide_' + Math.random().toString(32).slice(2);
        }

        return function printNode(node, options = {}) {
            options = Object.assign({ testing: false, inBody: false }, options);
            const cloneNode = node.cloneNode(true);
            const nodeEls = node.querySelectorAll('input,select');
            const cloneNodeEls = cloneNode.querySelectorAll('input,select');
            nodeEls.forEach((el, idx) => cloneNodeEls[idx].value = el.value);
            node = cloneNode;
            const hideClassName = getHideClass();
            const otherElStyle = createStyle(`.${hideClassName} { transition: 0ms!important;opacity: 0!important;display: none!important;visibility:hidden!important; }`);
            document.head.appendChild(otherElStyle);
            const otherEl = new Set;
            const wrapper = options.inBody ? document.body : document.documentElement;
            Array.from(wrapper.children).forEach(e => {
                // 隐藏其它 dom 元素
                if (e !== node && e.nodeType === 1) {
                    e.classList.add(hideClassName);
                    otherEl.add(e);
                }
            });
            wrapper.appendChild(node);
            window.print();
            const clearEffect = function () {
                node.remove();
                otherElStyle.remove();
                otherEl.forEach(value => {
                    value.classList.remove(hideClassName)
                });
            }
            if (options.testing) {
                return clearEffect;
            } else {
                clearEffect();
            }
        }
    })(),
    getNodesByBreadth: deepLoop.getNodesByBreadth,
    getNodesByDeep: deepLoop.getNodesByDeep
};
export default utils;