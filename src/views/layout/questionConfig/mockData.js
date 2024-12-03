// 前台表单结构
const formFields = {
    formKey: '',
    formName: '',
    values: [
        {
            formItemKey: ''
        }
    ]
}

const computeFormState = {
    'formItemKey': {
        formItemKey: '',
        value: ''
    }
}

/**
 * @description 根据已有的部分 data，和 结构，生成完整的 data。
 * @param values { Array } values
 * @param groups { Object } 结构
 * @return { Array }
 * */
function createIntactData(values, groups) {
    const valueMap = {};
    values.forEach(v => {
        valueMap[v.formItemKey] = v;
    });
    groups.forEach(g => {
        g.formItems.forEach(formItem => {
            if (!valueMap[formItem.formItemKey]) {
                valueMap[formItem.formItemKey] = {
                    formItemKey: formItem.formItemKey,
                    detailValue: formItemDictMap[formItem.formItemType].createDefaultValue(),
                };
            }
        });
    });
    return Object.values(valueMap);
}

let mockData = {
    formName: '配置的假表单',
    formKey: '表单的唯一标识',
    groups: [ // 配置的组
        {
            groupName: '组一',
            groupKey: 'firstGroup',
            formItems: [
                {
                    formItemKey: '组一的项目一', // 应该自动生成
                    formItemCode: 'code1', // 默认自动生成
                    label: '编程语言', // 手动输入
                    type: 'VRadio', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 控制表单项是否显示在前台
                    isMiddleUse: false, // 是否只是用来中转的中间项
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: []
                    },
                    formItemStruct: {
                        options: [
                            {
                                label: 'JavaScript',
                                code: 'JavaScript'
                            },
                            {
                                label: 'Python',
                                code: 'Python'
                            },
                            {
                                label: 'Java',
                                code: 'Java'
                            },
                        ],
                    }
                },
                {
                    formItemKey: '组一的项目二', // 应该自动生成
                    formItemCode: 'code2', // 默认自动生成
                    label: '作文', // 手动输入
                    type: 'VInput', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isMiddleUse: false, // 是否只是用来中转的中间项
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: []
                    },
                    formItemStruct: {
                        options: [],
                    }
                },
                {
                    formItemKey: '组一的项目一和项目二的条件组合起来的中间件',
                    formItemCode: 'code3', // 默认自动生成
                    label: '组一的项目一和项目二的条件组合起来的中间件',
                    type: 'VInput',
                    required: false,
                    isShow: false,
                    isMiddleUse: true, // 是否只是用来中转的中间项
                    message: '',
                    conditionStruct: {
                        relation: '&',
                        conditionList: [
                            {
                                conditionKey: "组二的项目一的条件一",
                                model: "组一的项目一", // 字段名（这里用的是formItemKey的值）
                                modelType: "VRadio",
                                modelMiddleUse: false,
                                conditionValue: "JavaScript", // 这个字段的值
                            },
                            {
                                conditionKey: '组二的项目一的条件二',
                                model: "组一的项目二", // 字段名（这里用的是formItemKey的值）
                                modelType: "VInput",
                                modelMiddleUse: false,
                                conditionValue: "1", // 这个字段的值
                            },
                        ]
                    },
                    formItemStruct: {
                        options:[]
                    }
                },
                {
                    formItemKey: '组一的项目三', // 应该自动生成
                    formItemCode: 'code4', // 默认自动生成
                    label: '爱好', // 手动输入
                    type: 'VCheckbox', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true,
                    isMiddleUse: false, // 是否只是用来中转的中间项
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: []
                    },
                    formItemStruct: {
                        options: [
                            {
                                label: '足球',
                                code: 'FootBall'
                            },
                            {
                                label: '篮球',
                                code: 'BasketBall'
                            },
                        ],
                    }
                },
                {
                    formItemKey: '组一的项目一和项目二的条件组合起来的中间件以及项目三',
                    formItemCode: 'code5', // 默认自动生成
                    label: '组一的项目一和项目二的条件组合起来的中间件以及项目三',
                    type: 'VInput',
                    required: false,
                    isShow: false,
                    isMiddleUse: true, // 是否只是用来中转的中间项
                    message: '',
                    conditionStruct: {
                        relation: '&',
                        conditionList: [
                            {
                                conditionKey: "中间件二的条件一",
                                model: "组一的项目一和项目二的条件组合起来的中间件", // 字段名（这里用的是formItemKey的值）
                                modelType: "VInput",
                                modelMiddleUse: true,
                                conditionValue: "", // 这个字段的值
                            },
                            {
                                conditionKey: '中间件二的条件二',
                                model: "组一的项目三", // 字段名（这里用的是formItemKey的值）
                                modelType: "VCheckbox",
                                modelMiddleUse: false,
                                conditionValue: ['BasketBall', 'FootBall'], // 这个字段的值
                            },
                        ]
                    },
                    formItemStruct: {
                        options:[]
                    }
                },
                {
                    formItemKey: '组一的项目四', // 应该自动生成
                    formItemCode: 'code6', // 默认自动生成
                    label: '项目四', // 手动输入
                    type: 'VInput', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isMiddleUse: false, // 是否只是用来中转的中间项
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: []
                    },
                    formItemStruct: {
                        options: [],
                    }
                },
            ]
        },
        {
            groupName: '组二',
            groupKey: 'secondGroup',
            formItems: [
                {
                    formItemKey: '组二的项目一', // 应该自动生成
                    formItemCode: 'code7', // 默认自动生成
                    label: '擅长的前端框架',
                    type: 'VCheckbox',
                    required: true,
                    isShow: true,
                    isMiddleUse: false, // 是否只是用来中转的中间项
                    message: '不为空',
                    conditionStruct: {
                        relation: '||',
                        conditionList: [
                            {
                                conditionKey: '组二的项目一的条件一conditionKey',
                                model: "组一的项目四", // 字段名（这里用的是formItemKey的值）
                                modelType: "VInput",
                                modelMiddleUse: false,
                                conditionValue: '2', // 这个字段的值
                            },
                            {
                                conditionKey: '组二的项目一的条件二conditionKey',
                                model: "组一的项目一和项目二的条件组合起来的中间件以及项目三", // 字段名（这里用的是formItemKey的值）
                                modelType: "VInput",
                                modelMiddleUse: true,
                                conditionValue: '', // 这个字段的值
                            },
                        ]
                    },
                    formItemStruct: {
                        options:[
                            {
                                label: 'Vue',
                                code: 'Vue'
                            },
                            {
                                label: 'React',
                                code: 'React'
                            },
                            {
                                label: 'Angular',
                                code: 'Angular'
                            }
                        ]
                    }
                },
            ]
        }
    ]
};
function createConditionLine() {
    return {
        conditionKey: createUniqueKey('conditionKey'),
        model: '',
        conditionValue: '',
        modelType: "VInput",
        modelMiddleUse: false,
    }
}
function updateMockData (formStruct) {
    mockData = formStruct;
    // sessionStorage.setItem('questionFormConfig', JSON.stringify(mockData));
}

function createFormItemOptionsMap(formStruct) {
    const formItemOptionsMap = new Map();
    const { groups } = formStruct;
    groups.forEach(group => {
        group.formItems.forEach(formItem => {
            formItemOptionsMap.set(formItem.formItemKey, formItem.formItemStruct.options);
        })
    });
}
function createFormItemMap(formStruct) {
    const { groups } = formStruct;
    let formItemTypeMap = new Map();
    // 所有表单项的code数组
    const allFormItemCodeArr = [];
    console.log(22222, JSON.parse(JSON.stringify(allFormItemCodeArr)), groups);
    // 用来计算每个表单项的“是否显示”的Map
    let formItemSelectArr = [];
    formItemSelectArr = groups.map(group => {
        return {
            groupName: group.groupName,
            groupKey: group.groupKey,
            formItems: group.formItems.map(formItem => {
                formItemTypeMap.set(formItem.formItemKey, {
                    type: formItem.type,
                    isMiddleUse: formItem.isMiddleUse,
                    options: formItem.formItemStruct.options,
                    conditionStruct: formItem.conditionStruct,
                });
                console.log('formItem.formItemCode999999:', formItem.formItemCode)
                allFormItemCodeArr.push(formItem.formItemCode);
                return {
                    formItemKey: formItem.formItemKey,
                    label: formItem.label
                }
            })
        }
    })

    return {
        formItemTypeMap,
        formItemSelectArr,
        allFormItemCodeArr
    }
}

// 创建一个辅助函数，用来计算每个表单项的“是否显示”
// formState
function computeIsShowFormItem(formStruct, computeFormState, formItemTypeMap) {
    console.log('computeIsShowFormItem');
    let formItemIsShowMap = new Map();
    const { groups } = formStruct;
    groups.forEach(group => {
        group.formItems.forEach(formItem => {
            const { conditionStruct } = formItem;
            formItemIsShowMap.set(formItem.formItemKey, deepFindConditionList(conditionStruct, computeFormState, formItemTypeMap));
        })
    })
    return {
        formItemIsShowMap
    }
}
// 递归查找某个中间件的关联条件项
function deepFindConditionList(conditionStruct, computeFormState, formItemTypeMap) {
    const { relation, conditionList } = conditionStruct;
    let result = true;
    const conditionResultArr = conditionList.map(conditionItem => {
        if (conditionItem.modelMiddleUse) {
            return deepFindConditionList(formItemTypeMap.get(conditionItem.model).conditionStruct, computeFormState, formItemTypeMap);
        } else {
            return !!isEqual(computeFormState[conditionItem.model].value, conditionItem.conditionValue, conditionItem.modelType);
        }
    })
    if (relation === '&') {
        result =  conditionResultArr.every(item => item);
    } else if (relation === '||') {
        result =  conditionResultArr.some(item => item);
    }
    return result;
}
// 判断两个值是否相等
function isEqual(value, conditionValue, modelType) {
    if (stringPropertyTypes.includes(modelType)) {
        return value === conditionValue;
    } else if (booleanPropertyTypes.includes(modelType)) {
        return value === conditionValue;
    } else if (arrayPropertyTypes.includes(modelType)) {
        return value.length === conditionValue.length && conditionValue.every(item => value.includes(item));
    }
}

const abc = {
    relation: '&',
    conditionList: [
        {
            value: '111',
            isMiddleUse: true,
            relation: '||',
            conditionList: [
                {
                    value: '111',
                    isMiddleUse: false,
                    relation: '&',
                    conditionList: []
                },
                {
                    value: '2222',
                    isMiddleUse: false,
                    relation: '&',
                    conditionList: []
                }
            ]
        },
        {
            value: '111',
            isMiddleUse: false,
            relation: '&&',
            conditionList: []
        }
    ]
}

// 区分绑定值的类型
const arrayPropertyTypes = ['VCheckbox', 'VMultipleSelect'];
const booleanPropertyTypes = ['VSwitch'];
const stringPropertyTypes = ['VRadio', 'VDateTime', 'VSingleSelect', 'VInput'];
const defaultConditionValueMap = {
    VCheckbox: [],
    VMultipleSelect: [],
    VSwitch: false,
    VRadio: '',
    VDateTime: '',
    VSingleSelect: '',
    VInput: '',
};
// 可动态配置选择项的组件
const dynamicComponentType = ['VCheckbox', 'VMultipleSelect', 'VRadio', 'VSingleSelect'];
// 下拉组件类型
const componentsList = [
    {
        label: '输入框',
        value: 'VInput'
    },
    {
        label: '日期时间选择器',
        value: 'VDateTime'
    },
    {
        label: '下拉单选',
        value: 'VSingleSelect'
    },
    {
        label: '下拉多选',
        value: 'VMultipleSelect'
    },
    {
        label: '单选框',
        value: 'VRadio'
    },
    {
        label: 'switch开关',
        value: 'VSwitch'
    },
    {
        label: '复选框',
        value: 'VCheckbox'
    }
];
const relationList = [
    {
        label: '并且',
        value: '&'
    },
    {
        label: '或者',
        value: '||'
    }
]

function createUniqueKey(prefix = '') {
    const key = Math.random().toString(32).slice(2);
    return prefix ? `${prefix}_${key}` : key;
}

export {
    mockData,
    dynamicComponentType,
    arrayPropertyTypes,
    booleanPropertyTypes,
    stringPropertyTypes,
    defaultConditionValueMap,
    componentsList,
    relationList,
    createUniqueKey,
    createFormItemMap,
    updateMockData,
    createConditionLine,
    computeIsShowFormItem
}