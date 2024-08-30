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
                    label: '编程语言', // 手动输入
                    type: 'VRadio', // 下拉选择组件
                    required: true, // 校验是否必填
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: [
                        ]
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
                    label: '作文', // 手动输入
                    type: 'VInput', // 下拉选择组件
                    required: false, // 校验是否必填
                    message: '不为空', // 校验时候的信息
                    conditionStruct: {
                        relation: '&',
                        conditionList: [
                        ]
                    },
                    formItemStruct: {
                        options: [],
                    }
                },
                {
                    formItemKey: '组一的项目三', // 应该自动生成
                    label: '爱好', // 手动输入
                    type: 'VCheckbox', // 下拉选择组件
                    required: false, // 校验是否必填
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
            ]
        },
        {
            groupName: '组二',
            groupKey: 'secondGroup',
            formItems: [
                {
                    formItemKey: '组二的项目一', // 应该自动生成
                    label: '擅长的前端框架',
                    type: 'VCheckbox',
                    required: true,
                    message: '不为空',
                    conditionStruct: {
                        relation: '&',
                        conditionList: [
                            {
                                conditionKey: "组二的项目一的条件一",
                                model: "组一的项目一", // 字段名（这里用的是formItemKey的值）
                                modelType: "VRadio",
                                conditionValue: "JavaScript", // 这个字段的值
                            },
                            {
                                conditionKey: '组二的项目一的条件二',
                                model: "组一的项目二", // 字段名（这里用的是formItemKey的值）
                                modelType: "VInput",
                                conditionValue: "1", // 这个字段的值
                            },
                            {
                                conditionKey: '组二的项目一的条件三',
                                model: "组一的项目三", // 字段名（这里用的是formItemKey的值）
                                modelType: "VCheckbox",
                                conditionValue: ['BasketBall', 'FootBall'], // 这个字段的值
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
        conditionValue: ''
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
    // 用来计算每个表单项的“是否显示”的Map
    let formItemSelectArr = [];
    formItemSelectArr = groups.map(group => {
        return {
            groupName: group.groupName,
            groupKey: group.groupKey,
            formItems: group.formItems.map(formItem => {
                formItemTypeMap.set(formItem.formItemKey, {
                    type: formItem.type,
                    options: formItem.formItemStruct.options
                });
                return {
                    formItemKey: formItem.formItemKey,
                    label: formItem.label
                }
            })
        }
    })

    return {
        formItemTypeMap,
        formItemSelectArr
    }
}

// 创建一个辅助函数，用来计算每个表单项的“是否显示”
// formState
function computeIsShowFormItem(formStruct, computeFormState) {
    console.log('computeIsShowFormItem');
    let formItemIsShowMap = new Map();
    const { groups } = formStruct;
    groups.forEach(group => {
        group.formItems.forEach(formItem => {
            let result = true;
            const { conditionStruct } = formItem;
            const { relation, conditionList } = conditionStruct;
            // conditionList 后台配置的时候，里面会校验不为空
            const conditionResultArr = conditionList.map(conditionItem => {
                return !!isEqual(computeFormState[conditionItem.model].value, conditionItem.conditionValue, conditionItem.modelType);
            })
            if (relation === '&') {
                result = conditionResultArr.every(item => item);
            } else if (relation === '||') {
                result = conditionResultArr.some(item => item);
            }
            formItemIsShowMap.set(formItem.formItemKey, result);
        })
    })
    return {
        formItemIsShowMap
    }
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