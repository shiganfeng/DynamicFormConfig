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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VRadio', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 控制表单项是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VInput', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VInput',
                    required: false,
                    isShow: false,
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VCheckbox', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true,
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VInput',
                    required: false,
                    isShow: false,
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VInput', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VCheckbox',
                    required: true,
                    isShow: true,
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
        },
        {
            groupName: '组三',
            groupKey: 'thirdGroup',
            formItems: [
                {
                    formItemKey: '组三的项目一', // 应该自动生成
                    formItemCode: 'code8', // 默认自动生成
                    label: '依赖值一',
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VNumber', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目二', // 应该自动生成
                    formItemCode: 'code9', // 默认自动生成
                    label: '依赖值二',
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VNumber', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目三', // 应该自动生成
                    formItemCode: 'code10', // 默认自动生成
                    label: '依赖值一加依赖值二',
                    methodType: 'ComputeAdd', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目一', // 字段名（这里用的是formItemKey的值）
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目四', // 应该自动生成
                    formItemCode: 'code11', // 默认自动生成
                    label: '依赖值一减依赖值二',
                    methodType: 'ComputeSubtract', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目一', // 字段名（这里用的是formItemKey的值）
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目五', // 应该自动生成
                    formItemCode: 'code12', // 默认自动生成
                    label: '依赖值一乘以依赖值二',
                    methodType: 'ComputeMultiplication', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目一', // 字段名（这里用的是formItemKey的值）
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目六', // 应该自动生成
                    formItemCode: 'code13', // 默认自动生成
                    label: '依赖值一除以依赖值二',
                    methodType: 'ComputeDivision', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目一', // 字段名（这里用的是formItemKey的值）
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目七', // 应该自动生成
                    formItemCode: 'code14', // 默认自动生成
                    label: '依赖值一取余依赖值二',
                    methodType: 'ComputeRemainder', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目一', // 字段名（这里用的是formItemKey的值）
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目八', // 应该自动生成
                    formItemCode: 'code15', // 默认自动生成
                    label: '等于(依赖值一加依赖值二)',
                    methodType: 'ComputeEqual', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目三', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组三的项目九', // 应该自动生成
                    formItemCode: 'code16', // 默认自动生成
                    label: '等于第二行加第三行',
                    methodType: 'ComputeAdd', // 数据来源方式
                    methodTypeParams: [
                        '组三的项目二', // 字段名（这里用的是formItemKey的值）
                        '组三的项目三', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VComputeText', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
            groupName: '组四',
            groupKey: 'fourthGroup',
            formItems: [
                {
                    formItemKey: '组四的项目一', // 应该自动生成
                    formItemCode: 'code17', // 默认自动生成
                    label: '依赖值一',
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VNumber', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组四的项目二', // 应该自动生成
                    formItemCode: 'code18', // 默认自动生成
                    label: '依赖值二',
                    methodType: '', // 数据来源方式
                    methodTypeParams: [], // 数据来源参数
                    type: 'VNumber', // 下拉选择组件
                    required: true, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: false, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组四的项目三', // 应该自动生成
                    formItemCode: 'code19', // 默认自动生成
                    label: '依赖值一除以依赖值二(百分比显示)',
                    methodType: 'ComputeDivision', // 数据来源方式
                    methodTypeParams: [
                        '组四的项目一', // 字段名（这里用的是formItemKey的值）
                        '组四的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VPercent', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
                    formItemKey: '组四的项目四', // 应该自动生成
                    formItemCode: 'code20', // 默认自动生成
                    label: '依赖值一除以依赖值二(千分比显示)',
                    methodType: 'ComputeDivision', // 数据来源方式
                    methodTypeParams: [
                        '组四的项目一', // 字段名（这里用的是formItemKey的值）
                        '组四的项目二', // 字段名（这里用的是formItemKey的值）
                    ], // 数据来源参数
                    type: 'VThousand', // 下拉选择组件
                    required: false, // 校验是否必填
                    isShow: true, // 是否显示在前台
                    isShowComputeValue: true, // 是否只是用来显示计算出来的值
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
            groupName: '组五',
            groupKey: 'fifthGroup',
            formItems: []
        },
        {
            groupName: '组六',
            groupKey: 'sixthGroup',
            formItems: []
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
    let formItemMethodParamsDependMap = new Map();
    // 所有表单项的code数组
    const allFormItemCodeArr = [];
    // console.log(22222, JSON.parse(JSON.stringify(allFormItemCodeArr)), groups);
    // 用来计算每个表单项的“是否显示”的Map
    let formItemSelectArr = [];
    formItemSelectArr = groups.map(group => {
        return {
            groupName: group.groupName,
            groupKey: group.groupKey,
            formItems: group.formItems.map(formItem => {
                formItemTypeMap.set(formItem.formItemKey, {
                    formItemKey: formItem.formItemKey,
                    type: formItem.type,
                    isMiddleUse: formItem.isMiddleUse,
                    options: formItem.formItemStruct.options,
                    conditionStruct: formItem.conditionStruct,
                    methodType: formItem.methodType,
                    methodTypeParams: formItem.methodTypeParams,
                });
                // console.log('formItem.formItemCode999999:', formItem.formItemCode)
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
// 所有key-Map
function createAllKey(formStruct) {
    const { groups } = formStruct;
    // 组的groupKey
    const allGroupKeySet = new Set();
    // 所有组内的formItemKey
    const allFormItemKeySet = new Set();
    // 以组的groupKey为key，这个组内的所有表单项的formItemKey为值，形成一个Map
    const allGroupFormItemKeyMap = new Map();
    groups.forEach(group => {
        allGroupKeySet.add(group.groupKey);
        let currentGroupFormItemsKeySet = allGroupFormItemKeyMap.get(group.groupKey);
        if (!currentGroupFormItemsKeySet) {
            currentGroupFormItemsKeySet = new Set();
            allGroupFormItemKeyMap.set(group.groupKey, currentGroupFormItemsKeySet);
        }

        group.formItems.forEach(formItem => {
            currentGroupFormItemsKeySet.add(formItem.formItemKey);
            allFormItemKeySet.add(formItem.formItemKey);
        })
    });
    console.log('allGroupKeySet:', allGroupKeySet);
    console.log('allFormItemKeySet:', allFormItemKeySet);
    console.log('allGroupFormItemKeyMap:', allGroupFormItemKeyMap);
    return {
        allGroupKeySet,
        allFormItemKeySet,
        allGroupFormItemKeyMap
    }
}

// 计算每一个表单项的计算依赖
function createFormItemDependMap(formStruct) {
    const { groups } = formStruct;
    let formItemMethodParamsDependMap = new Map();
    groups.forEach(group => {
        group.formItems.forEach(formItem => {
            // console.log('formItem------:', formItem);
            formItem.methodTypeParams.forEach(paramKey => {
                // console.log('paramKey------:', paramKey);
                let ddcDependSet = formItemMethodParamsDependMap.get(paramKey);
                if (!ddcDependSet) {
                    ddcDependSet = new Set();
                    formItemMethodParamsDependMap.set(paramKey, ddcDependSet);
                }
                ddcDependSet.add(formItem.formItemKey);
            })
        })
    })

    return {
        formItemMethodParamsDependMap
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
    VNumber: '',
    VPercent: '',
    VThousand: '',
    VComputeText: '',
};
const formatValueDictMap = {
    VPercent: {
        formItemType: 'VPercent',
        formItemTypeName: '百分比',
        formItemTypeDescription: '百分比显示器，限制只可以输入数字，并将承载的值乘100然后拼接％后的结果显示',
        methodCompute(value) {
            let v = value;
            if (isEmpty(v)) {
                return '';
            } else {
                if (v === '0' || v === 0) {
                    return '0%';
                } else {
                    return (v * 100).toFixed(2) + '%';
                }
            }
        },
    },
    VThousand: {
        formItemType: 'VThousand',
        formItemTypeName: '千分比',
        formItemTypeDescription: '千分比显示器，限制只可以输入数字，并将承载的值乘1000然后拼接‰后的结果显示',
        methodCompute(value) {
            let v = value;
            if (isEmpty(v)) {
                return '';
            } else {
                if (v === '0' || v === 0) {
                    return '0‰';
                } else {
                    return (v * 1000).toFixed(2) + '‰';
                }
            }
        },
    }
}
const formatValue = (value, formatType) => {
    const resultMap = formatValueDictMap[formatType];
    return resultMap.methodCompute(value);
}
// 可动态配置选择项的组件
const dynamicComponentType = ['VCheckbox', 'VMultipleSelect', 'VRadio', 'VSingleSelect'];
// 下拉组件类型
const componentsList = [
    {
        label: '输入框',
        value: 'VInput'
    },
    {
        label: '数字',
        value: 'VNumber'
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
    },
    {
        label: '百分比',
        value: 'VPercent'
    },
    {
        label: '千分比',
        value: 'VThousand'
    },
    {
        label: '计算文本',
        value: 'VComputeText'
    }
];
const componentRequiredMethodTypeList = ['VPercent', 'VThousand', 'VComputeText'];
const relationList = [
    {
        label: '并且',
        value: '&'
    },
    {
        label: '或者',
        value: '||'
    }
];

function isEmpty(value) {
    const empty = new Set(['', null, '-', undefined, NaN, Infinity]);
    return empty.has(value);
}
const valueSourceDict = [
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
            // 过滤有效数字
            const numberArgs = args.filter(item => !isEmpty(item));
            // 等到所有参数都是数字类型才计算
            if (!numberArgs.length || (numberArgs.length !== args.length)) {
                return '';
            }
            return numberArgs.reduce((sum, value) => {
                return sum + value;
            });
        },
    },
    {
        methodType: 'ComputeSubtract',
        methodTypeName: '运算-相减',
        methodTypeDescription: '自动计算目标们之间总差。可额外配置输入功能。',
        methodCompute(args = []) {
            // 过滤有效数字
            const numberArgs = args.filter(item => !isEmpty(item));
            if (!numberArgs.length || (numberArgs.length !== args.length)) {
                return '';
            }
            return numberArgs.reduce((sum, value) => {
                return sum - value;
            });
        },
    },
    {
        methodType: 'ComputeMultiplication',
        methodTypeName: '运算-相乘',
        methodTypeDescription: '自动计算目标们之间总乘。可额外配置输入功能。',
        methodCompute(args = []) {
            // 过滤有效数字
            const numberArgs = args.filter(item => !isEmpty(item));
            if (!numberArgs.length || (numberArgs.length !== args.length)) {
                return '';
            }
            return args.reduce((sum, value) => {
                return sum * value;
            });
        },
    },
    {
        methodType: 'ComputeDivision',
        methodTypeName: '运算-相除',
        methodTypeDescription: '自动计算目标们之间总除。可额外配置输入功能。',
        methodCompute(args = []) {
            // 过滤有效数字
            const numberArgs = args.filter(item => !isEmpty(item));
            if (!numberArgs.length || (numberArgs.length !== args.length)) {
                return '';
            }
            // 查看有没有分母是0的情况，这时候应该不进行计算
            if (numberArgs.some(arg => arg === 0 || arg === '0')) {
                return '';
            }
            return args.reduce((sum, value) => {
                return sum / value;
            });
        },
    },
    {
        methodType: 'ComputeRemainder',
        methodTypeName: '运算-取余',
        methodTypeDescription: '自动计算目标们之间总余。可额外配置输入功能。',
        methodCompute(args = []) {
            // 过滤有效数字
            const numberArgs = args.filter(item => !isEmpty(item));
            if (!numberArgs.length || (numberArgs.length !== args.length)) {
                return '';
            }
            // 查看有没有分母是0的情况，这时候应该不进行计算
            if (args.some(arg => arg === 0 || arg === '0')) {
                return '';
            }
            return args.reduce((sum, value) => {
                return sum % value;
            });
        },
    },
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
    componentRequiredMethodTypeList,
    valueSourceDict,
    formatValue,
    createUniqueKey,
    createFormItemMap,
    createFormItemDependMap,
    updateMockData,
    createConditionLine,
    computeIsShowFormItem,
    createAllKey
}