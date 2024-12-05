<template>
    <div class="VForm">
        <div class="top">
            <div class="left">
 
            </div>
            <div class="right">
                <a-button
                    :type="isFoldAllGroup ? 'primary' : 'default'"
                    @click="foldOrUnFoldAllGroupClick"
                >
                    {{isFoldAllGroup ? '展开' : '折叠'}}所有分组
                </a-button>
                <a-button
                    :type="isFoldAllFormItem ? 'primary' : 'default'"
                    @click="foldOrUnFoldAllFormItemClick"
                >
                    {{isFoldAllFormItem ? '展开' : '折叠'}}所有表单项
                </a-button>
            </div>
        </div>
        <a-form
            ref="modelFormRef"
            :disabled="disabled"
            :model="formStruct"
            :validate-messages="{ required: '${label}必填' }"
            layout="horizontal"
        >
            <draggable
                v-model="formStruct.groups"
                tag="div"
                class="groups"
                handle=".groupDragButton"
                itemKey="groupKey"
                :animation="200"
                :scrollSensitivity="150"
                :scrollSpeed="50"
            >
                <template #item="{ element: group, index: groupIndex }">
                    <VGroup
                        :key="group.groupKey"
                        :formItemIndexes="['groups', groupIndex]"
                        :group="group"
                        :groupIndex="groupIndex"
                        :formItemSelectArr="formItemSelectArr"
                        :allFormItemCodeArr="allFormItemCodeArr"
                        :formItemTypeMap="formItemTypeMap"
                        :formItemMethodParamsDependMap="formItemMethodParamsDependMap"
                        :foldsKey="foldsKey"
                        :isFoldAllInGroupFormItemKeyMap="isFoldAllInGroupFormItemKeyMap"
                        v-model:groupName="group.groupName"
                        @addOptionItem="addOptionItem"
                        @deleteOptionItem="deleteOptionItem"
                        @addConditionLine="addConditionLine"
                        @modelChange="modelChange"
                        @conditionValueChange="conditionValueChange"
                        @delConditionLine="delConditionLine"
                        @foldOrUnFoldFormItemClick="foldOrUnFoldFormItemClick"
                        @foldOrUnFoldGroupClick="foldOrUnFoldGroupClick"
                        @foldOrUnFoldGroupAllFormItemClick="foldOrUnFoldGroupAllFormItemClick"
                        @deleteFormItem="(formItemIndex) => deleteFormItem(group, formItemIndex)"
                        @deleteGroup="deleteGroup"
                    ></VGroup>
                </template>
            </draggable>
        </a-form>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import VGroup from "./components/VGroup/VGroup.vue";

export default defineComponent({
    components: {
        VGroup
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
        disabled: {
            type: Boolean,
            default: false
        },
        formStruct: {
            type: Object,
            default: () => ({
                formName: '',
                formKey: '',
                groups: []
            })
        },
        formItemSelectArr: {
            type: Array,
            default: () => ([])
        },
        formItemTypeMap: {
            type: Map,
            default: () => (new Map())
        },
        foldsKey: {
            type: Set,
            default: () => (new Set())
        },
        isFoldAllInGroupFormItemKeyMap: {
            type: Map,
            default: () => (new Map())
        },
        isFoldAllGroup: {
            type: Boolean,
            default: false
        },
        isFoldAllFormItem: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'addOptionItem',
        'deleteOptionItem',
        'addConditionLine',
        'modelChange',
        'conditionValueChange',
        'delConditionLine',
        'foldOrUnFoldFormItemClick',
        'foldOrUnFoldGroupClick',
        'foldOrUnFoldGroupAllFormItemClick',
        'foldOrUnFoldAllGroupClick',
        'foldOrUnFoldAllFormItemClick',
        'deleteFormItem',
        'deleteGroup'
    ],
    setup(props, ctx) {
        const formChunk = (() => {
            const modelFormRef = ref(null);
            const foldOrUnFoldFormItemClick = (formItemKey) => {
                ctx.emit('foldOrUnFoldFormItemClick', formItemKey);
            };
            const foldOrUnFoldGroupClick = (groupKey) => {
                ctx.emit('foldOrUnFoldGroupClick', groupKey);
            };
            const foldOrUnFoldGroupAllFormItemClick = (groupKey) => {
                ctx.emit('foldOrUnFoldGroupAllFormItemClick', groupKey);
            };
            const foldOrUnFoldAllGroupClick = () => {
                ctx.emit('foldOrUnFoldAllGroupClick');
            };
            const foldOrUnFoldAllFormItemClick = () => {
                ctx.emit('foldOrUnFoldAllFormItemClick');
            };
            const deleteFormItem = (group, formItemIndex) => {
                ctx.emit('deleteFormItem', group, formItemIndex);
            };
            const deleteGroup = (groupIndex) => {
                ctx.emit('deleteGroup', groupIndex);
            };
            const addOptionItem = (formItem, optionItem) => {
                ctx.emit('addOptionItem', formItem, optionItem);
            }
            const deleteOptionItem = (formItem, itemIndex) => {
                ctx.emit('deleteOptionItem', formItem, itemIndex);
            }
            const addConditionLine = (formItem) => {
                ctx.emit('addConditionLine', formItem);
            };
            const delConditionLine = (formItem, conditionLineIndex) => {
                ctx.emit('delConditionLine', formItem, conditionLineIndex);
            };
            const modelChange = (conditionLine, value) => {
                ctx.emit('modelChange', conditionLine, value);
            };
            const conditionValueChange = (conditionLine, value) => {
                ctx.emit('conditionValueChange', conditionLine, value);
            }
            return {
                modelFormRef,
                addOptionItem,
                deleteOptionItem,
                addConditionLine,
                modelChange,
                conditionValueChange,
                delConditionLine,
                foldOrUnFoldFormItemClick,
                foldOrUnFoldGroupClick,
                foldOrUnFoldGroupAllFormItemClick,
                foldOrUnFoldAllGroupClick,
                foldOrUnFoldAllFormItemClick,
                deleteFormItem,
                deleteGroup
            }
        })();
        
        return {
            modelFormRef: formChunk.modelFormRef,
            addOptionItem: formChunk.addOptionItem,
            deleteOptionItem: formChunk.deleteOptionItem,
            addConditionLine: formChunk.addConditionLine,
            modelChange: formChunk.modelChange,
            conditionValueChange: formChunk.conditionValueChange,
            delConditionLine: formChunk.delConditionLine,
            foldOrUnFoldFormItemClick: formChunk.foldOrUnFoldFormItemClick,
            foldOrUnFoldGroupClick: formChunk.foldOrUnFoldGroupClick,
            foldOrUnFoldGroupAllFormItemClick: formChunk.foldOrUnFoldGroupAllFormItemClick,
            foldOrUnFoldAllGroupClick: formChunk.foldOrUnFoldAllGroupClick,
            foldOrUnFoldAllFormItemClick: formChunk.foldOrUnFoldAllFormItemClick,
            deleteFormItem: formChunk.deleteFormItem,
            deleteGroup: formChunk.deleteGroup,
        }
    }
})
</script>

<style scoped lang="scss">
.VForm {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 16px;
    &>.top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        &>.left {
        
        }
        &>.right {
            display: flex;
            gap: 16px;
            align-items: center;
        }
    }
    .groups {
        display: flex;
        flex-direction: column;
    }
}
</style>