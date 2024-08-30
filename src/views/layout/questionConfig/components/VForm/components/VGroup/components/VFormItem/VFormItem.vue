<template>
    <div class="VFormItem">
        <div class="top">
            <div class="item">
                <div class="label">标题：</div>
                <div class="con">
                    <a-input
                        :value="label"
                        @update:value="labelChange"
                    ></a-input>
                </div>
            </div>
            <div class="item">
                <div class="label">组件类型：</div>
                <div class="con">
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
                </div>
            </div>
            <div class="item">
                <div class="label">是否必填：</div>
                <div class="con">
                    <a-switch
                        :checked="required"
                        @change="requiredChange"
                    ></a-switch>
                </div>
            </div>
            <div class="item">
                <div class="label">必填提示文字：</div>
                <div class="con">
                    <a-input
                        :value="message"
                        @update:value="messageChange"
                    ></a-input>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="line">
                <div class="item">
                    <div class="label">动态配置选择项（例如下拉单选，下拉多选，单选框，多选框）：</div>
                    <div class="con">
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
                    </div>
                </div>
            </div>
            <div class="lineGroup">
                <div class="label">显示当前表单项的条件（例如其他的表单项选择了特定的值才显示）：</div>
                <div class="lineCon">
                    <div class="top">
                        <div class="label">选定项直接的条件关系：</div>
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
                    </div>
                    <div
                        v-for="conditionLine in formItem.conditionStruct.conditionList"
                        :key="conditionLine.conditionKey"
                        class="line"
                    >
                        <div class="item">
                            <div class="con">
                                <a-select
                                    :value="conditionLine.model"
                                    style="width: 350px"
                                    allow-clear
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
                            </div>
                        </div>
                        <div v-if="conditionLine.model" class="item">
                            <div class="label">选择了前面特定表单项的值：</div>
                            <div class="con">
                                <component
                                    :is="transFormType(conditionLine.model).type"
                                    :value="conditionLine.conditionValue"
                                    :options="transFormType(conditionLine.model).options"
                                    @update:value="(value) => conditionValueChange(conditionLine, value)"
                                ></component>
                            </div>
                        </div>
                        <a-button type="danger">删除</a-button>
                    </div>
                    <a-button type="primary" @click="addFormStructLine">添加条件项</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import { componentsList, createUniqueKey, defaultConditionValueMap, relationList } from "../../../../../../mockData.js";
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
        formItemSelectArr: {
            type: Array,
            default: () => ([])
        },
        formItemTypeMap: {
            type: Map,
            default: () => (new Map())
        },
        formItemIsShowMap: {
            type: Map,
            default: () => (new Map())
        },
        formItem: {
            type: Object,
            default: () => ({
                formItemKey: '', // 应该自动生成
                label: '', // 手动输入
                type: '', // 下拉选择组件
                required: true, // 校验是否必填
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
        type: {
            type: String,
            default: 'VInput'
        },
        required: {
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
        'update:type',
        'update:required',
        'update:message',
        'update:options',
        'update:relation',
        'addOptionItem',
        'deleteOptionItem',
        'addFormStructLine',
        'modelChange',
        'conditionValueChange'
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
            const typeChange = (value) => {
                ctx.emit('update:type', value);
            };
            const requiredChange = (value) => {
                ctx.emit('update:required', value);
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
                ctx.emit('conditionValueChange', conditionLine, '');
                ctx.emit('modelChange', conditionLine, value);
                const type = (props.formItemTypeMap.get(value) || {
                    type: 'VInput',
                    options: []
                }).type;
                ctx.emit('conditionValueChange', conditionLine, defaultConditionValueMap[type]);
            }
            const conditionValueChange = (conditionLine, value) => {
                ctx.emit('conditionValueChange', conditionLine, value);
            }
            const addFormStructLine = () => {
                ctx.emit('addFormStructLine');
            }
            return {
                labelChange,
                typeChange,
                requiredChange,
                messageChange,
                optionsChange,
                relationChange,
                modelChange,
                conditionValueChange,
                addOptionItem,
                deleteOptionItem,
                addFormStructLine,
                addOptionItemLabel
            }
        })();
        
        return {
            transFormType,
            componentsList,
            relationList,
            labelChange: formItemChunk.labelChange,
            typeChange: formItemChunk.typeChange,
            requiredChange: formItemChunk.requiredChange,
            messageChange: formItemChunk.messageChange,
            optionsChange: formItemChunk.optionsChange,
            relationChange: formItemChunk.relationChange,
            modelChange: formItemChunk.modelChange,
            conditionValueChange: formItemChunk.conditionValueChange,
            addOptionItem: formItemChunk.addOptionItem,
            deleteOptionItem: formItemChunk.deleteOptionItem,
            addFormStructLine: formItemChunk.addFormStructLine,
            addOptionItemLabel: formItemChunk.addOptionItemLabel,
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
        gap: 32px;
        margin-bottom: 16px;
        &>.item {
            display: flex;
            align-items: center;
            &>.con {
                &>.ant-input {
                    width: 180px;
                }
                &>.ant-select {
                    width: 180px;
                }
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
                &>.con {
                    &>.ant-input {
                        width: 180px;
                    }
                    &>.ant-select {
                        width: 180px;
                    }
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
                    align-items: center;
                    &>.item {
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>