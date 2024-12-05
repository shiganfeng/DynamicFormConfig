<template>
    <div class="VFormItem">
        <div class="top">
            <div class="item">
                <a-form-item
                    label="标题"
                    :name="[...formItemIndexes, 'label']"
                    :rules="[{ required: true }]"
                >
                    <a-input
                        :value="label"
                        @update:value="labelChange"
                        placeholder="请输入"
                    ></a-input>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="项的提取code(可用做提取业务)"
                    :name="[...formItemIndexes, 'formItemCode']"
                    :rules="formItemCodeRule"
                >
                    <a-input
                        :value="formItemCode"
                        @update:value="formItemCodeChange"
                        placeholder="请输入"
                    ></a-input>
                </a-form-item>
            </div>
        </div>
        <div class="top">
            <div class="item">
                <a-form-item
                    label="组件类型"
                    :name="[...formItemIndexes, 'type']"
                    :rules="[{ required: true }]"
                >
                    <a-select
                        :value="type"
                        placeholder="Please select"
                        @update:value="typeChange"
                    >
                        <a-select-option
                            v-for="item in componentsList"
                            :key="item.value"
                            :value="item.value"
                        >{{item.label}}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="是否必填"
                >
                    <a-switch
                        :checked="required"
                        @change="requiredChange"
                    ></a-switch>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="必填提示文字"
                    :name="[...formItemIndexes, 'message']"
                    :rules="messageRule"
                >
                    <a-input
                        :value="message"
                        @update:value="messageChange"
                        placeholder="请输入"
                    ></a-input>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="是否显示在表单中"
                >
                    <a-switch
                        :checked="isShow"
                        @change="isShowChange"
                    ></a-switch>
                </a-form-item>
            </div>
            <div class="item">
                <!-- 当做一些依赖自动计算的时候用到（仅用于显示） -->
                <a-form-item
                    label="是否禁用"
                >
                    <a-switch
                        :checked="isShowComputeValue"
                        @change="isShowComputeValueChange"
                    ></a-switch>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="是否只是用来中转的中间项"
                >
                    <a-switch
                        :checked="isMiddleUse"
                        @change="isMiddleUseChange"
                    ></a-switch>
                </a-form-item>
            </div>
        </div>
        <div class="top">
            <div class="item">
                <a-form-item
                    label="数据来源方式"
                    :name="[...formItemIndexes, 'methodType']"
                    :rules="methodTypeRule"
                >
                    <a-select
                        :value="methodType"
                        placeholder="Please select"
                        @update:value="methodTypeChange"
                    >
                        <a-select-option
                            v-for="item in valueSourceDict"
                            :key="item.methodType"
                            :value="item.methodType"
                        >{{item.methodTypeName}}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="item">
                <a-form-item
                    label="数据来源参数"
                    :name="[...formItemIndexes, 'methodTypeParams']"
                    :rules="methodTypeRule"
                >
                    <a-select
                        :value="methodTypeParams"
                        mode="multiple"
                        style="width: 350px"
                        @change="methodTypeParamsChange"
                    >
                        <a-select-opt-group
                            v-for="selectGroup in formItemSelectArr"
                            :key="selectGroup.groupKey"
                            :label="selectGroup.groupName"
                        >
                            <!-- 自身不可选 -->
                            <a-select-option
                                v-for="selectFormItem in selectGroup.formItems"
                                :key="selectFormItem.formItemKey"
                                :label="selectFormItem.label"
                                :disabled="selectFormItem.formItemKey === formItem.formItemKey || methodParamsSelectSet.has(selectFormItem.formItemKey)"
                                :value="selectFormItem.formItemKey"
                            >{{selectFormItem.label}}</a-select-option>
                        </a-select-opt-group>
                    </a-select>
                </a-form-item>
            </div>
        </div>
        <div class="content">
            <div v-if="dynamicComponentType.includes(type)" class="line">
                <div class="item">
                    <a-form-item
                        label="动态配置选择项（例如下拉单选，下拉多选，单选框，多选框）"
                    >
                        <a-select
                            placeholder="自定义下拉选项"
                            style="width: 300px"
                        >
                            <a-select-option
                                v-for="(item, itemIndex) in options"
                                :key="item.code"
                                :value="item.code"
                            >
                                <div class="customOptionItem">
                                    <div class="text">{{item.label}}</div>
                                    <div class="del" @click.stop="deleteOptionItem(itemIndex)">
                                        <CloseCircleOutlined />
                                    </div>
                                </div>
                            </a-select-option>
                            <template #dropdownRender="{ menuNode: menu }">
                                <v-nodes :vnodes="menu" />
                                <a-divider style="margin: 4px 0" />
                                <a-space style="padding: 4px 8px">
                                    <a-input ref="inputRef" v-model:value="addOptionItemLabel" placeholder="增加选项" />
                                    <a-button type="text" @click="addOptionItem">
                                        <template #icon>
                                            <plus-outlined />
                                        </template>
                                        增加选项
                                    </a-button>
                                </a-space>
                            </template>
                        </a-select>
                    </a-form-item>
                </div>
            </div>
            <div class="lineGroup">
                <div class="label">显示当前表单项的条件（例如其他的表单项选择了特定的值才显示）：</div>
                <div class="lineCon">
                    <div class="top">
                        <a-form-item
                            label="选定项直接的条件关系"
                            :name="[...formItemIndexes, 'conditionStruct', 'relation']"
                            :rules="[{ required: true }]"
                        >
                            <a-select
                                :value="relation"
                                placeholder="Please select"
                                @update:value="relationChange"
                            >
                                <a-select-option
                                    v-for="item in relationList"
                                    :key="item.value"
                                    :value="item.value"
                                >{{item.label}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div
                        v-for="(conditionLine, conditionLineIndex) in formItem.conditionStruct.conditionList"
                        :key="conditionLine.conditionKey"
                        class="line"
                    >
                        <div class="item">
                            <a-form-item
                                :label="`条件${conditionLineIndex + 1}`"
                                :name="[...formItemIndexes, 'conditionStruct', 'conditionList', conditionLineIndex, 'model']"
                                :rules="[{ required: true }]"
                            >
                                <a-select
                                    :value="conditionLine.model"
                                    style="width: 350px"
                                    @change="(value) => modelChange(conditionLine, value)"
                                >
                                    <a-select-opt-group
                                        v-for="selectGroup in formItemSelectArr"
                                        :key="selectGroup.groupKey"
                                        :label="selectGroup.groupName"
                                    >
                                        <!-- 自身不可选 -->
                                        <a-select-option
                                            v-for="selectFormItem in selectGroup.formItems"
                                            :key="selectFormItem.formItemKey"
                                            :label="selectFormItem.label"
                                            :disabled="selectFormItem.formItemKey === formItem.formItemKey"
                                            :value="selectFormItem.formItemKey"
                                        >{{selectFormItem.label}}</a-select-option>
                                    </a-select-opt-group>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div v-if="conditionLine.model && !conditionLine.modelMiddleUse" class="item">
                            <a-form-item
                                label="选择了前面特定表单项的值"
                                :name="[...formItemIndexes, 'conditionStruct', 'conditionList', conditionLineIndex, 'conditionValue']"
                                :rules="[{ required: true }]"
                            >
                                <component
                                    :is="transFormType(conditionLine.model).type"
                                    :value="conditionLine.conditionValue"
                                    :options="transFormType(conditionLine.model).options"
                                    @update:value="(value) => conditionValueChange(conditionLine, value)"
                                ></component>
                            </a-form-item>
                        </div>
                        <a-button type="primary" danger @click="delConditionLine(conditionLineIndex)">删除</a-button>
                    </div>
                    <a-button type="primary" @click="addConditionLine">添加条件项</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent, nextTick, ref} from "vue";
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import { componentRequiredMethodTypeList, componentsList, createUniqueKey, defaultConditionValueMap, relationList, dynamicComponentType, valueSourceDict } from "../../../../../../mockData.js";
import {message} from "ant-design-vue";
import VInput from "../../../../../../../question/components/VInput.vue";
import VCheckbox from "../../../../../../../question/components/VCheckbox.vue";
import VRadio from "../../../../../../../question/components/VRadio.vue";
import VDateTime from "../../../../../../../question/components/VDateTime.vue";
import VSingleSelect from "../../../../../../../question/components/VSingleSelect.vue";
import VMultipleSelect from "../../../../../../../question/components/VMultipleSelect.vue";
import VSwitch from "../../../../../../../question/components/VSwitch.vue";

const VNodes = defineComponent({
    props: {
        vnodes: {
            type: Object,
            required: true,
        },
    },
    render() {
        return this.vnodes;
    },
});
export default defineComponent({
    components: {
        PlusOutlined,
        CloseCircleOutlined,
        VNodes,
        VInput,
        VCheckbox,
        VRadio,
        VDateTime,
        VSingleSelect,
        VMultipleSelect,
        VSwitch,
    },
    props: {
        formItemMethodParamsDependMap: {
            type: Map,
            default: () => new Map()
        },
        allFormItemCodeArr: {
            type: Array,
            default: () => ([]),  
        },
        formItemIndexes: {
            type: Array,
            required: true,
            default: () => ([]),
        },
        formItemSelectArr: {
            type: Array,
            default: () => ([])
        },
        formItemTypeMap: {
            type: Map,
            default: () => (new Map())
        },
        formItem: {
            type: Object,
            default: () => ({
                formItemKey: '', // 应该自动生成
                code: '',
                label: '', // 手动输入
                type: '', // 下拉选择组件
                required: true, // 校验是否必填
                isShow: true, // 是否显示在表单中
                isShowComputeValue: false, // 是否只是用来显示计算出来的值
                methodType: '',
                methodTypeParams: [],
                isMiddleUse: false, // 是否只是用来中转的中间项
                message: '', // 校验时候的信息
                conditionStruct: {
                    relation: '&',
                    conditionList: [
                        {
                            conditionKey: '',
                            model: '', // 字段名（这里用的是formItemKey的值）
                            conditionValue: '', // 这个字段的值
                        }
                    ]
                },
                formItemStruct: {
                    options: []
                }
            })
        },
        label: {
            type: String,
            default: ''
        },
        formItemCode: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'VInput'
        },
        methodType: {
            type: String,
            default: ''
        },
        methodTypeParams: {
            type: Array,
            default: () => ([])
        },
        required: {
            type: Boolean,
            default: false
        },
        isShow: {
            type: Boolean,
            default: true
        },
        isShowComputeValue: {
            type: Boolean,
            default: false
        },
        isMiddleUse: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => ([])
        },
        relation: {
            type: String,
            default: '&'
        }
    },
    emits: [
        'update:label',
        'update:formItemCode',
        'update:type',
        'update:methodType',
        'update:methodTypeParams',
        'update:required',
        'update:isShow',
        'update:isShowComputeValue',
        'update:isMiddleUse',
        'update:message',
        'update:options',
        'update:relation',
        'addOptionItem',
        'deleteOptionItem',
        'addConditionLine',
        'delConditionLine',
        'modelChange',
        'conditionValueChange',
    ],
    setup(props, ctx) {
        const transFormType = (model) => {
            return (props.formItemTypeMap.get(model) || {
                type: 'VInput',
                options: []
            })
        }
        const formItemChunk = (() => {
            const labelChange = (value) => {
                ctx.emit('update:label', value);
            };
            const formItemCodeChange = (value) => {
                ctx.emit('update:formItemCode', value);
            };
            const typeChange = (value) => {
                ctx.emit('update:type', value);
            };
            const methodTypeChange = (value) => {
                ctx.emit('update:methodType', value);
            };
            const methodTypeParamsChange = (value) => {
                ctx.emit('update:methodTypeParams', value);
            };
            const requiredChange = (value) => {
                ctx.emit('update:required', value);
            }
            const isShowChange = (value) => {
                ctx.emit('update:isShow', value);
            }
            const isShowComputeValueChange = (value) => {
                ctx.emit('update:isShowComputeValue', value);
            }
            const isMiddleUseChange = (value) => {
                ctx.emit('update:isMiddleUse', value);
            }
            const messageChange = (value) => {
                ctx.emit('update:message', value);
            };
            const optionsChange = (value) => {
                ctx.emit('update:options', value);
            };
            const relationChange = (value) => {
                ctx.emit('update:relation', value);
            };
            const addOptionItemLabel = ref('');
            const addOptionItem = () => {
                if (!addOptionItemLabel.value) return message.warning('内容不为空！');
                let code = createUniqueKey('formItem');
                const optionsCodeList = props.options.map(item => item.code);
                if (optionsCodeList.includes(code)) {
                    message.warning('选项code重复，请重新添加添加！');
                    return;
                }
                 ctx.emit('addOptionItem', {
                     label: addOptionItemLabel.value,
                     code: createUniqueKey('formItem')
                 })
                addOptionItemLabel.value = '';
            };
            const deleteOptionItem = (itemIndex) => {
                ctx.emit('deleteOptionItem', itemIndex);
            };
            const modelChange = (conditionLine, value) => {
                // 组件类型不同，先清空值
                ctx.emit('conditionValueChange', conditionLine, '');
                ctx.emit('modelChange', conditionLine, value);
                const type = (props.formItemTypeMap.get(value) || {
                    type: 'VInput',
                    options: []
                }).type;
                // 再设置对应组件类型的默认值
                ctx.emit('conditionValueChange', conditionLine, defaultConditionValueMap[type]);
            }
            const conditionValueChange = (conditionLine, value) => {
                ctx.emit('conditionValueChange', conditionLine, value);
            }
            const addConditionLine = () => {
                ctx.emit('addConditionLine');
            }
            const delConditionLine = (conditionLineIndex) => {
                ctx.emit('delConditionLine', conditionLineIndex);
            }
            // 要什么响应式的，因为props.required会变化
            const messageRule = computed(() => {
                return [
                    {
                        validator:  async (_rule, value) => {
                            await nextTick();
                            if(value !== 0) {
                                value = (value || '').trim();
                            }
                            if (props.required && value === '') {
                                return Promise.reject('是否必填选择必填时，文字不为空');
                            }
                        },
                        required: props.required,
                        trigger: ['change', 'blur'],
                    }
                ]
            });
            // 判断表单项code是否重复
            const isDuplication = computed( () => {
                console.log('allFormItemCodeArr3333:', props.allFormItemCodeArr);
                let num = 0;
                for(let i = 0; i < props.allFormItemCodeArr.length; i++) {
                    console.log(7777, props.allFormItemCodeArr[i], props.formItemCode)
                    if (props.allFormItemCodeArr[i] === props.formItemCode) {
                        num++;
                        if (num >= 2) {
                            break;
                        }
                    }
                }
                console.log('num:', num)
                return num >= 2;
            });
            const methodTypeRule = computed(() => {
                return [
                    {
                        required: componentRequiredMethodTypeList.includes(props.type),
                        trigger: ['change', 'blur'],
                    }
                ]
            });
            const methodParamsSelectSet = computed(() => {
                return props.formItemMethodParamsDependMap.get(props.formItem.formItemKey) || new Set();
            })
            const formItemCodeRule = [
                {
                    validator: async (_rule, value) => {
                        // 等待 allFormItemCodeArr 赋值完成。
                        await nextTick();
                        if(value !== 0) {
                            value = (value || '').trim();
                        }
                        if (value === '') {
                            return Promise.reject('表单项code必填');
                        } else {
                            if (isDuplication.value) {
                                return Promise.reject('表单项code不可以重复');
                            }
                        }
                    },
                    required: true,
                    trigger: ['change', 'blur'],
                }
            ];
            return {
                labelChange,
                formItemCodeChange,
                typeChange,
                methodTypeChange,
                methodTypeParamsChange,
                requiredChange,
                isShowChange,
                isShowComputeValueChange,
                isMiddleUseChange,
                messageChange,
                optionsChange,
                relationChange,
                modelChange,
                conditionValueChange,
                addOptionItem,
                deleteOptionItem,
                addConditionLine,
                delConditionLine,
                addOptionItemLabel,
                messageRule,
                formItemCodeRule,
                methodTypeRule,
                methodParamsSelectSet
            }
        })();
        
        return {
            transFormType,
            componentRequiredMethodTypeList,
            componentsList,
            relationList,
            valueSourceDict,
            dynamicComponentType,
            labelChange: formItemChunk.labelChange,
            formItemCodeChange: formItemChunk.formItemCodeChange,
            typeChange: formItemChunk.typeChange,
            methodTypeChange: formItemChunk.methodTypeChange,
            methodTypeParamsChange: formItemChunk.methodTypeParamsChange,
            requiredChange: formItemChunk.requiredChange,
            isShowChange: formItemChunk.isShowChange,
            isShowComputeValueChange: formItemChunk.isShowComputeValueChange,
            isMiddleUseChange: formItemChunk.isMiddleUseChange,
            messageChange: formItemChunk.messageChange,
            optionsChange: formItemChunk.optionsChange,
            relationChange: formItemChunk.relationChange,
            modelChange: formItemChunk.modelChange,
            conditionValueChange: formItemChunk.conditionValueChange,
            addOptionItem: formItemChunk.addOptionItem,
            deleteOptionItem: formItemChunk.deleteOptionItem,
            addConditionLine: formItemChunk.addConditionLine,
            delConditionLine: formItemChunk.delConditionLine,
            addOptionItemLabel: formItemChunk.addOptionItemLabel,
            messageRule: formItemChunk.messageRule,
            formItemCodeRule: formItemChunk.formItemCodeRule,
            methodTypeRule: formItemChunk.methodTypeRule,
            methodParamsSelectSet: formItemChunk.methodParamsSelectSet,
        }
    }
})
</script>
<style lang="scss">
.customOptionItem {
    display: flex;
    justify-content: space-between;
    &>.del {
        color: #ff4d4f;
    }
}
</style>
<style scoped lang="scss">
.VFormItem {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
    &:last-child {
        margin-bottom: 0;
    }
    &>.top {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 32px;
        &>.item {
            display: flex;
            align-items: center;
            .ant-input {
                width: 180px;
            }
            .ant-select {
                width: 180px;
            }
        }
    }
    &>.content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        &>.line {
            width: 100%;
            display: flex;
            gap: 32px;
            &>.item {
                display: flex;
                align-items: center;
                .ant-input {
                    width: 180px;
                }
                .ant-select {
                    width: 180px;
                }
            }
        }
        &>.lineGroup {
            width: 100%;
            display: flex;
            align-items: baseline;
            &>.lineCon {
                width: 0;
                flex: 1 0 auto;
                display: flex;
                gap: 16px;
                flex-direction: column;
                padding: 8px;
                background-color: #FFB733;
                border-radius: 8px;
                &>.top {
                    display: flex;
                    align-items: center;
                }
                &>.line {
                    width: 100%;
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    &>.item {
                        &>.ant-form-item {
                            //margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>