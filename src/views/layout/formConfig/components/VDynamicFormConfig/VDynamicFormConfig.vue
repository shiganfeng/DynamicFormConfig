<template>
    <div class="VDynamicFormConfig">
        <a-form
            ref="modalFormRef"
            :disabled="disabled"
            :model="dynamicFormStruct"
            :validate-messages="{ required: '${label}必填', }"
            layout="vertical"
        >
            <div class="VDynamicFormConfigContainer">
                <div class="baseInfo">
                    <div class="container">
                        <div class="item">
                            <a-form-item
                                label="表单名称"
                                name="formName"
                            >
                                <VText :text="dynamicFormStruct.formName" />
                            </a-form-item>
                        </div>
                        <div class="item">
                            <a-form-item
                                label="表单业务标识"
                                name="formCode"
                            >
                                <VText :text="dynamicFormStruct.formCode" />
                            </a-form-item>
                        </div>
                        <div class="item">
                            <a-form-item
                                label="备注"
                                name="postscript"
                            >
                                <!-- eslint-disable -->
                                <a-input
                                    v-model:value="dynamicFormStruct.formStruct.postscript"
                                    placeholder="请输入"
                                />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="control">
                        <VFoldToggleButton
                            :checkedValue="isFoldAllFormItem"
                            trueText="展开所有表单项"
                            falseText="折叠所有表单项"
                            @click="foldOrUnFoldAllFormItemClick"
                        />
                        <VFoldToggleButton
                            :checkedValue="isFoldAllGroup"
                            trueText="展开所有分组"
                            falseText="折叠所有分组"
                            @click="foldOrUnFoldAllGroupClick"
                        />
                        <a-button
                            type="primary"
                            @click="addGroup"
                        >添加分组</a-button>
                        <a-button
                            type="primary"
                            @click="submit"
                        >保存</a-button>
                    </div>
                </div>
                <vueDraggable
                    v-model="dynamicFormStruct.formStruct.groups"
                    tag="div"
                    class="groups"
                    handle=".groupDragButton"
                    item-key="uniqueKey"
                    :animation="200"
                    :scrollSensitivity="150"
                    :scrollSpeed="50"
                >
                    <template #item="{element: group, index: groupIndex}">
                        <VFormConfigGroup
                            :key="group.uniqueKey"
                            :formItemIndexes="['formStruct', 'groups', groupIndex]"
                            :groupIndex="groupIndex"
                            :group="group"
                            :methodTypeParamsOptions="methodTypeParamsOptions"
                            :depend="depend"
                            :allKey="allKey"
                            :allCode="allCode"
                            :folds="folds"
                            :isFoldAllGroupFormItemKey="isFoldAllGroupFormItemKeyMap.get(group.uniqueKey)"
                            @methodTypeChange="methodTypeChange"
                            @subGroup="subGroup(groupIndex)"
                            @addFormItem="addFormItem(group)"
                            @removeFromItemClick="formItemIndex => removeFromItemClick(group, formItemIndex)"
                            @foldOrUnGroupAllFormItemClick="foldOrUnGroupAllFormItemClick"
                            @foldOrUnGroupClick="foldOrUnGroupClick"
                            @foldOrUnFoldFormItemClick="foldOrUnFoldFormItemClick"
                        ></VFormConfigGroup>
                    </template>
                </vueDraggable>
            </div>
        </a-form>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import dfs from "../../dfs.js";
import VText from "./components/VText/VText.vue";
import VFoldToggleButton from "../../../components/VFoldToggleButton/VFoldToggleButton.vue";
import VFormConfigGroup from "./components/VFormConfigGroup/VFormConfigGroup.vue";
import vueDraggable from "vuedraggable";

export default defineComponent({
    name: 'VDynamicFormConfig',
    components: {
        VText,
        VFoldToggleButton,
        VFormConfigGroup,
        vueDraggable
    },
    emits: [
        'foldOrUnFoldAllFormItemClick',
        'foldOrUnFoldAllGroupClick',
        'foldOrUnGroupClick',
        'foldOrUnGroupAllFormItemClick',
        'foldOrUnFoldFormItemClick',
        'addGroup',
        'subGroup',
        'submit',
        'removeFromItemClick',
        'addFormItem',
        'methodTypeChange'
    ],
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        dynamicFormStruct: {
            type: Object,
            default: () => (dfs.createDynamicForm())
        },
        methodTypeParamsOptions: {
            type: Array,
            default: () => ([
                // dfs.createGroup()
            ])
        },
        depend: {
            type: Object,
            default: () => ({
                effectMethodTypeDependMap: new Map(),
                allFlatMethodTypeParams: new Set(),
            }),
        },
        allKey: {
            type: Object,
            default: () => ({
                allGroupUniqueKeySet: new Set(),
                allFormItemUniqueKeyFlatSet: new Set(),
                allGroupFormItemUniqueKeyMap: new Map()
            })
        },
        allCode: {
            type: Object,
            default: () => ({
                allGroupCodeSet: new Set(),
                allGroupCodeArray: [],
                allFormItemDetailCodeFlatSet: new Set(),
                allFormItemDetailCodeFlatArray: [],
                allGroupFormItemDetailCodeMap: new Map(),
                allGroupFormItemDetailCodeArrayMap: new Map(),
            }),
        },
        folds: {
            type: Set,
            default: () => new Set()
        },
        isFoldAllGroup: {
            type: Boolean,
            default: false
        },
        isFoldAllFormItem: {
            type: Boolean,
            default: false
        },
        isFoldAllGroupFormItemKeyMap: {
            type: Map,
            default: () => new Map()
        }
    },
    setup(props, ctx) {
        const modalFormRef = ref(null);
        const methodTypeChange = (formItem, methodType) => {
            ctx.emit('methodTypeChange', formItem, methodType);
        };
        // 展开或折叠 所有组
        const foldOrUnFoldAllGroupClick = () => {
            ctx.emit('foldOrUnFoldAllGroupClick');
        };
        // 展开或折叠 所有组内表单项
        const foldOrUnFoldAllFormItemClick = () => {
            ctx.emit('foldOrUnFoldAllFormItemClick');
        };
        // 展开或折叠 某个组
        const foldOrUnGroupClick = (groupUniqueKey) => {
            ctx.emit('foldOrUnGroupClick', groupUniqueKey);
        };
        // 展开或折叠 某个组内的所有表单项
        const foldOrUnGroupAllFormItemClick = (groupUniqueKey) => {
            ctx.emit('foldOrUnGroupAllFormItemClick', groupUniqueKey);
        };
        // 展开或折叠 某个表单项
        const foldOrUnFoldFormItemClick = (formItemUniqueKey) => {
            ctx.emit('foldOrUnFoldFormItemClick', formItemUniqueKey);
        };
        const addGroup = () => {
            ctx.emit('addGroup');
        };
        const subGroup = (groupIndex) => {
            ctx.emit('subGroup', groupIndex);
        }
        const removeFromItemClick = (group, formItemIndex) => {
            ctx.emit('removeFromItemClick', group, formItemIndex);
        };
        const addFormItem = (group) => {
            ctx.emit('addFormItem', group);
        }
        
        const submit = () => {
            ctx.emit('submit');
        };
        
        return {
            modalFormRef,
            foldOrUnFoldAllFormItemClick,
            foldOrUnFoldAllGroupClick,
            foldOrUnGroupClick,
            foldOrUnGroupAllFormItemClick,
            foldOrUnFoldFormItemClick,
            addGroup,
            subGroup,
            removeFromItemClick,
            addFormItem,
            submit,
            methodTypeChange
        }
    }
})

</script>

<style scoped lang="scss">
.VDynamicFormConfig {
    width: 100%;
    height: 100%;
    &>.ant-form {
        width: 100%;
        height: 100%;
        &>.VDynamicFormConfigContainer {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            &>.baseInfo {
                width: 100%;
                flex: none;
                display: flex;
                align-items: flex-start;
                &>.container {
                    width: 0;
                    flex: 1 0 auto;
                    display: flex;
                    align-items: center;
                    margin-left: 16px;
                    &>.item  {
                        width: 230px;
                        &:not(:first-of-type)  {
                            margin-left: 16px;
                        }
                    }
                }
                &>.control {
                    flex: none;
                    display: flex;
                    align-items: center;
                    &>.ant-btn  {
                        margin-right: 10px;
                    }
                    &>.dragButton  {
                        flex: none;
                        cursor: pointer;
                    }
                }
            }
            &>.groups {
                height: 0;
                flex: 1 0 auto;
                overflow-y: auto;
                &>.VFormConfigGroup  {
                    &:not(:first-of-type)  {
                        margin-top: 16px;
                    }
                }
            }
            &>.buttonControl  {
                flex: none;
                display: flex;
                align-items: center;
                margin-top: 16px;
                padding-left: 16px;
            }
        }
    }
}
</style>