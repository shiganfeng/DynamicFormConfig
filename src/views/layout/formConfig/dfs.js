import utils from "../../../utils/utils.js";
/**
 * @description 表单项组件列表。
 * */
function formItemDict() {
    const formItemDict = [
        {
            formItemType: 'VInputText',
            formItemTypeName: '文本',
            formItemTypeDescription: '文本输入框，可以输入任何内容',
        },
        {
            formItemType: 'VInputNumber',
            formItemTypeName: '数字',
            formItemTypeDescription: '数字显示器，限制只可以输入数字(-.0-9)',
        },
        {
            formItemType: 'VRateHundred',
            formItemTypeName: '百分比',
            formItemTypeDescription: '百分比显示器，限制只可以输入数字，并将承载的值乘100然后拼接％后的结果显示',
        },
        {
            formItemType: 'VRateThousand',
            formItemTypeName: '千分比',
            formItemTypeDescription: '千分比显示器，限制只可以输入数字，并将承载的值乘1000然后拼接‰后的结果显示',
        },
        {
            formItemType: 'VRatioColon',
            formItemTypeName: '几比几',
            formItemTypeDescription: '几比几显示器，限制只可以输入数字，并将承载的值显示为n:n',
        },
        {
            formItemType: 'VHidden',
            formItemTypeName: '隐藏',
            formItemTypeDescription: '可以承载任何值，不会在页面显示，用于承载复杂运算时的中间变量，复杂运算指：需要用到2种及2种以上【运算方式】的运算',
        },
    ];
    const formItemDictMap = utils.createMap(
        formItemDict,
        ['formItemType']
    )[0];
    Object.freeze(formItemDict);
    Object.freeze(formItemDictMap);
    return {
        formItemDict,
        formItemDictMap,
    }
}

/**
 * @description 表单项组件的数据来源方式。
 * */
function valueSourceDict() {
    const valueSourceDict = [
        {
            methodType: 'OnlyInput',
            methodTypeName: '仅输入',
            methodTypeDescription: '仅输入',
            methodCompute(args = []) {
                // 不会被调用，因为 OnlyInput 无法选择 methodTypeParams，除非程序有bug
            },
        },
        {
            methodType: 'ComputeEqual',
            methodTypeName: '运算-等于',
            methodTypeDescription: '自动单向同步目标值。可额外配置输入功能。',
            methodCompute(args = []) {
                return args[0];
            },
        },
        {
            methodType: 'ComputeAdd',
            methodTypeName: '运算-相加',
            methodTypeDescription: '自动计算目标们之间总和。可额外配置输入功能。',
            methodCompute(args = []) {
                let target = args.shift() * 1;
                let normal = Boolean(args.length);
                for (let v of args) {
                    v = v * 1;
                    // 这个检查防止 v*1 的结果是非数，比如 NaN、Infinity
                    if (utils.isEmpty(v)) {
                        normal = false;
                        break;
                    } else {
                        target += v;
                    }
                }
                if (normal) {
                    return target;
                } else {
                    return '';
                }
            },
        },
        {
            methodType: 'ComputeSubtract',
            methodTypeName: '运算-相减',
            methodTypeDescription: '自动计算目标们之间总差。可额外配置输入功能。',
            methodCompute(args = []) {
                let target = args.shift() * 1;
                let normal = Boolean(args.length);
                for (let v of args) {
                    v = v * 1;
                    // 这个检查防止 v*1 的结果是非数，比如 NaN、Infinity
                    if (utils.isEmpty(v)) {
                        normal = false;
                        break;
                    } else {
                        target -= v;
                    }
                }
                if (normal) {
                    return target;
                } else {
                    return '';
                }
            },
        },
        {
            methodType: 'ComputeMultiplication',
            methodTypeName: '运算-相乘',
            methodTypeDescription: '自动计算目标们之间总乘。可额外配置输入功能。',
            methodCompute(args = []) {
                let target = args.shift() * 1;
                let normal = Boolean(args.length);
                for (let v of args) {
                    v = v * 1;
                    // 这个检查防止 v*1 的结果是非数，比如 NaN、Infinity
                    if (utils.isEmpty(v)) {
                        normal = false;
                        break;
                    } else {
                        target *= v;
                    }
                }
                if (normal) {
                    return target;
                } else {
                    return '';
                }
            },
        },
        {
            methodType: 'ComputeDivision',
            methodTypeName: '运算-相除',
            methodTypeDescription: '自动计算目标们之间总除。可额外配置输入功能。',
            methodCompute(args = []) {
                let target = args.shift() * 1;
                let normal = Boolean(args.length);
                for (let v of args) {
                    if (!utils.isEmpty(v)) {
                        v = v * 1;
                        if (v === 0) {
                            normal = false;
                            break;
                        }
                        target /= v;
                    } else {
                        normal = false;
                        break;
                    }
                }
                if (normal) {
                    return target;
                } else {
                    return '';
                }
            },
        },
        {
            methodType: 'ComputeRemainder',
            methodTypeName: '运算-取余',
            methodTypeDescription: '自动计算目标们之间总余。可额外配置输入功能。',
            methodCompute(args = []) {
                let target = args.shift() * 1;
                let normal = Boolean(args.length);
                for (let v of args) {
                    if (!utils.isEmpty(v)) {
                        v = v * 1;
                        if (v === 0) {
                            normal = false;
                            break;
                        }
                        target %= v;
                    } else {
                        normal = false;
                        break;
                    }
                }
                if (normal) {
                    return target;
                } else {
                    return '';
                }
            },
        },
    ];
    const valueSourceDictMap = utils.createMap(
        valueSourceDict,
        ['methodType']
    )[0];
    Object.freeze(valueSourceDict);
    Object.freeze(valueSourceDictMap);
    return {
        valueSourceDict,
        valueSourceDictMap,
    }
}

/**
 * @description 创建一个随机唯一标识
 * @param prefix { String } 标识前缀
 * @return { String }
 */
function createUniqueKey(prefix = '') {
    const key = Math.random().toString(32).slice(2);
    return prefix ? `${prefix}_${key}` : key;
}

/**
 * @description 创建表单项组件的 sourceMethod 部分
 * @param options { Object } 混入的参数信息
 * @return { Object }
 */
function createFormItemSourceMethod(options = {}) {
    return utils.assign({
        methodType: 'OnlyInput',
        methodTypeParams: []
    }, options);
}

/**
 * @description 创建表单项组件配置中的 sourceMethod 部分。
 * @param options { Object } 混入的参数信息
 * @return sourceMethod { Object } 组件配置
 * */
function createFormItemConfigSourceMethod(options = {}) {
    return utils.assign({
        methodType: 'OnlyInput',
        methodTypeParams: []
    }, options);
}

/**
 * @description 创建表单项组件的配置部分
 * @param options { Object } 混入的参数信息
 * @return { Object }
 */
function createFormItemConfig(options = {}) {
    return utils.assign({
        formItemType: 'VInputText',
        disabled: false,
        required: true,
        sourceMethod: createFormItemSourceMethod()
    }, options);
}

/**
 * @description 创建一个新的表单项组件
 * @param options { Object } 混入的参数信息
 * @return { Object }
 */
function createFormItem(options = {}) {
    return utils.assign({
        // uniqueKey 与业务代码无关，暂时用来实现展开折叠功能
        uniqueKey: createUniqueKey('v'),
        detailCode: createUniqueKey('code'),
        detailName: '',
        formItemStruct: {
            postscript: '',
            config: createFormItemConfig()
        }
    }, options);
}

/**
 * @description 创建一个组
 * @param options { Object } 混入的参数信息
 * @return { Object }
 */
function createGroup(options = {}){
    return utils.assign({
        // uniqueKey 与业务代码无关，暂时用来实现展开折叠功能
        uniqueKey: createUniqueKey('v'),
        groupCode: createUniqueKey('code'),
        groupName: '',
        groupStruct: {
            postscript: '',
            formItems: [
                // createFormItem()
            ]
        }
    }, options);
}

/**
 * @description 创建动态表单
 * @param options { Object } 混入的参数信息
 * @return { Object }
 */

function createDynamicForm(options = {}) {
    return utils.assign({
        // uniqueKey 与业务代码无关，暂时用来实现展开折叠功能
        id: createUniqueKey('v'),
        formCode: createUniqueKey('code'),
        formName: '',
        formStruct: {
            postscript: '',
            groups: [
                // createGroup()
            ]
        }
    }, options);
}

/**
 * @description 创建被依赖项Map 假如表单项一和表单项二 决定了 表单项三的值，那么最后会形成
 *  key 是被依赖项，value是key所决定的项的集合
 * {
 *     key: '项目一的detailCode', value: Set{'项目三的detailCode'}
 *     key: '项目二的detailCode', value: Set{'项目三的detailCode'}
 * }
 * @param dynamicForm { Object }
 * @return { Object }
 */
function createEffectMethodTypeDepend(dynamicForm = {}) {
    // 以表单项的detailCode为键，所有与这个表单项有关联的-表单项的detailCode的集合为值，形成Map
    // new Map(
    //     {
    //         '某个表单项的detailCode': new Set('关联细项一的detailCode', '关联细项二的detailCode')
    //     }
    // )
    const effectMethodTypeDependMap = new Map();
    // 所有 有关联的表单项的detailCode 的集合
    const allFlatMethodTypeParamsSet = new Set();

    dynamicForm.formStruct.groups.forEach(group => {
        group.groupStruct.formItems.forEach(formItem => {
            // 取出表单项的detailCode 和 关联的 methodTypeParams
            const {
                detailCode,
                formItemStruct: {
                    config: {
                        sourceMethod: {
                            methodTypeParams = []
                        }
                    }
                }
            } = formItem;

            methodTypeParams.forEach(dependDetailCode => {
                allFlatMethodTypeParamsSet.add(dependDetailCode);
                let currentDependSet = effectMethodTypeDependMap.get(dependDetailCode);
                if (!currentDependSet) {
                    currentDependSet = new Set();
                    effectMethodTypeDependMap.set(dependDetailCode, currentDependSet );
                }
                currentDependSet.add(detailCode);
            })
        })
    })
    console.log('effectMethodTypeDependMap:', effectMethodTypeDependMap);
    // 平铺所有的，有关联关系的，表单细项的detailCode
    console.log('allFlatMethodTypeParamsSet:', allFlatMethodTypeParamsSet);

    return {
        effectMethodTypeDependMap,
        allFlatMethodTypeParamsSet
    }
}

/**
 * @description 数据来源方式的 其它相关控制。
 * */
function valueSourceDictControlInfo() {
    const valueSourceDictControlInfo = [
        // {
        //     // 来源方式type
        //     // methodType: '',
        //     // 默认是否禁用 formItem
        //     // client_formItemDefaultDisabled: '',
        //     // 是否禁用->用于配置 formItem 是否禁用的【禁用】按钮
        //     // config_configDisabledDisabledControl: '',
        //     // 是否显示选择数据来源参数的控件
        //     // config_showMethodTypeParamsControl: '',
        //     // 可选择数据来源参数的数量
        //     // config_allowSelectMethodTypeParamsNumber: '',
        //     // 默认是否必填 formItem
        //     // client_formItemDefaultRequired: '',
        // },
        {
            methodType: 'OnlyInput',
            client_formItemDefaultDisabled: false,
            config_configDisabledDisabledControl: true,
            config_showMethodTypeParamsControl: false,
            config_allowSelectMethodTypeParamsNumber: 0,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeEqual',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: 1,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeAdd',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: Infinity,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeSubtract',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: Infinity,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeMultiplication',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: Infinity,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeDivision',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: Infinity,
            client_formItemDefaultRequired: true,
        },
        {
            methodType: 'ComputeRemainder',
            client_formItemDefaultDisabled: true,
            config_configDisabledDisabledControl: false,
            config_showMethodTypeParamsControl: true,
            config_allowSelectMethodTypeParamsNumber: Infinity,
            client_formItemDefaultRequired: true,
        },
    ];
    const valueSourceDictControlInfoMap = utils.createMap(
        valueSourceDictControlInfo,
        ['methodType']
    )[0];
    Object.freeze(valueSourceDictControlInfo);
    Object.freeze(valueSourceDictControlInfoMap);
    return {
        valueSourceDictControlInfo,
        valueSourceDictControlInfoMap,
    }
}

/**
 * @description 创建Map
 * @param dynamicForm { Object }
 * @return {{allGroupUniqueKeySet: Set<any>, allGroupFormItemUniqueKeyMap: Map<any, any>, allFormItemUniqueKeyFlatSet: Set<any>}}
 */
function createAllUniqueKey(dynamicForm = {}) {
    // 所有组的uniqueKey集合
    const allGroupUniqueKeySet = new Set();
    // 所有组内表单项的uniqueKey集合
    const allFormItemUniqueKeyFlatSet = new Set();
    // 以组的uniqueKey为键，这个组内的所有的表单项的uniqueKey的集合为值，形成Map
    const allGroupFormItemUniqueKeyMap = new Map();
    dynamicForm.formStruct.groups.forEach(g => {
        allGroupUniqueKeySet.add(g.uniqueKey);
        let currentGroupFormItemUniqueKeySet = allGroupFormItemUniqueKeyMap.get(g.uniqueKey);
        if(!currentGroupFormItemUniqueKeySet) {
            currentGroupFormItemUniqueKeySet = new Set();
            allGroupFormItemUniqueKeyMap.set(g.uniqueKey, currentGroupFormItemUniqueKeySet);
        }
        g.groupStruct.formItems.forEach(formItem => {
            currentGroupFormItemUniqueKeySet.add(formItem.uniqueKey);
            allFormItemUniqueKeyFlatSet.add(formItem.uniqueKey);
        })
    })

    console.log('allGroupUniqueKeySet:', allGroupUniqueKeySet);
    console.log('allFormItemUniqueKeyFlatSet:', allFormItemUniqueKeyFlatSet);
    console.log('allGroupFormItemUniqueKeyMap:', allGroupFormItemUniqueKeyMap);
    return {
        allGroupUniqueKeySet,
        allFormItemUniqueKeyFlatSet,
        allGroupFormItemUniqueKeyMap
    }
}

/**
 * @description 获取组的groupCode 组内项的detailCode
 * @param dynamicForm { Object }
 * @return { Object }
 */
function createAllCode(dynamicForm = {}) {
    // 所有组的groupCode 集合
    const allGroupCodeSet = new Set();
    // 所有组的groupCode 数组
    const allGroupCodeArray = [];
    // 所有表单项的detailCode 集合
    const allFormItemDetailCodeFlatSet = new Set();
    // 所有表单项的detailCode 数组(用来判断表单项的detailCode是否重复)
    const allFormItemDetailCodeFlatArray = [];
    // 以组的groupCode为键，组内表单项的detailCode的集合为值，形成Map
    const allGroupFormItemDetailCodeMap = new Map();
    // 以组的groupCode为键，组内表单项的detailCode的数组为值，形成Map
    const allGroupFormItemDetailCodeArrayMap = new Map();

    dynamicForm.formStruct.groups.forEach(g => {
        allGroupCodeSet.add(g.groupCode);
        allGroupCodeArray.push(g.groupCode);
        let currentGroupFormItemUniqueKeySet = allGroupFormItemDetailCodeMap.get(g.groupCode);
        if (!currentGroupFormItemUniqueKeySet) {
            currentGroupFormItemUniqueKeySet = new Set();
            allGroupFormItemDetailCodeMap.set(g.groupCode, currentGroupFormItemUniqueKeySet);
        }
        let currentGroupFormItemUniqueKeyArray = allGroupFormItemDetailCodeArrayMap.get(g.groupCode);
        if (!currentGroupFormItemUniqueKeyArray) {
            currentGroupFormItemUniqueKeyArray = [];
            allGroupFormItemDetailCodeArrayMap.set(g.groupCode, currentGroupFormItemUniqueKeyArray);
        }

        g.groupStruct.formItems.forEach(formItem => {
            currentGroupFormItemUniqueKeySet.add(formItem.detailCode);
            currentGroupFormItemUniqueKeyArray.push(formItem.detailCode);

            allFormItemDetailCodeFlatSet.add(formItem.detailCode);
            allFormItemDetailCodeFlatArray.push(formItem.detailCode);
        })
    })

    console.log('allGroupCodeSet:', allGroupCodeSet);
    console.log('allGroupCodeArray:', allGroupCodeArray);
    console.log('allFormItemDetailCodeFlatSet:', allFormItemDetailCodeFlatSet);
    console.log('allFormItemDetailCodeFlatArray:', allFormItemDetailCodeFlatArray);
    console.log('allGroupFormItemDetailCodeMap:', allGroupFormItemDetailCodeMap);
    console.log('allGroupFormItemDetailCodeArrayMap:', allGroupFormItemDetailCodeArrayMap);
    return {
        allGroupCodeSet,
        allGroupCodeArray,
        allFormItemDetailCodeFlatSet,
        allFormItemDetailCodeFlatArray,
        allGroupFormItemDetailCodeMap,
        allGroupFormItemDetailCodeArrayMap
    }
}

export default {
    ...formItemDict(),
    ...valueSourceDict(),
    ...valueSourceDictControlInfo(),
    createUniqueKey,
    createFormItemSourceMethod,
    createFormItemConfig,
    createFormItem,
    createGroup,
    createDynamicForm,
    createEffectMethodTypeDepend,
    createAllUniqueKey,
    createAllCode,
    createFormItemConfigSourceMethod
}