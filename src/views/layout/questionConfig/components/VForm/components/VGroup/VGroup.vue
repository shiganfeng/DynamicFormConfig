<template>
    <div class="VGroup">
        <div class="top">
            <div class="left">
                <a-form-item
                    label="分组名"
                    :name="[...formItemIndexes, 'groupName']"
                    :rules="[{ required: true }]"
                >
                    <a-input
                        :value="group.groupName"
                        @update:value="groupNameChange"
                        placeholder="请输入"
                    />
                </a-form-item>
            </div>
            <div class="right">
                <a-button class="groupDragButton" type="primary">拖动</a-button>
            </div>
        </div>
        <draggable
            v-model="group.formItems"
            tag="div"
            class="formItemsDiv"
            handle=".formItemDragButton"
            itemKey="formItemKey"
            :animation="200"
            :scrollSensitivity="150"
            :scrollSpeed="50"
        >
            <template #item="{ element: formItem, index: formItemIndex }">
                <VFormItem
                    :key="formItem.formItemKey"
                    :formItem="formItem"
                    :formItemIndex="formItemIndex"
                    :formItemIndexes="[...formItemIndexes, 'formItems', formItemIndex]"
                    :formItemSelectArr="formItemSelectArr"
                    :formItemTypeMap="formItemTypeMap"
                    :allFormItemCodeArr="allFormItemCodeArr"
                    :formItemMethodParamsDependMap="formItemMethodParamsDependMap"
                    v-model:label="formItem.label"
                    v-model:formItemCode="formItem.formItemCode"
                    v-model:type="formItem.type"
                    v-model:methodType="formItem.methodType"
                    v-model:methodTypeParams="formItem.methodTypeParams"
                    v-model:required="formItem.required"
                    v-model:isShow="formItem.isShow"
                    v-model:isShowComputeValue="formItem.isShowComputeValue"
                    v-model:isMiddleUse="formItem.isMiddleUse"
                    v-model:message="formItem.message"
                    v-model:options="formItem.formItemStruct.options"
                    v-model:relation="formItem.conditionStruct.relation"
                    @addOptionItem="(optionItem) => addOptionItem(formItem, optionItem)"
                    @deleteOptionItem="(itemIndex) => deleteOptionItem(formItem, itemIndex)"
                    @addConditionLine="addConditionLine(formItem)"
                    @delConditionLine="(conditionLineIndex) => delConditionLine(formItem, conditionLineIndex)"
                    @modelChange="modelChange"
                    @conditionValueChange="conditionValueChange"
                ></VFormItem>
            </template>
        </draggable>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import VFormItem from "./components/VFormItem/VFormItem.vue";

export default defineComponent({
    components: {
        VFormItem
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
        groupName: {
            type: String,
            default: ''
        },
        formItemIndexes: { // 触发表单验证的validate方法，属性必填
            type: Array,
            required: true,
            default: () => ([]),
        },
        groupIndex: {
            type: Number,
            required: true
        },
        group: {
            type: Object,
            default: () => ({
                groupName: '',
                groupKey: '',
                formItems: []
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
    },
    emits: [
        'addOptionItem',
        'deleteOptionItem',
        'addConditionLine',
        'modelChange',
        'conditionValueChange',
        'groupNameChange',
        'update:groupName',
        'delConditionLine'
    ],
    setup(props, ctx) {
        const formGroupChunk = (() => {
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
            const groupNameChange = (value) => {
                ctx.emit('update:groupName', value);
            }
            return {
                addOptionItem,
                deleteOptionItem,
                addConditionLine,
                modelChange,
                conditionValueChange,
                groupNameChange,
                delConditionLine,
            }
        })();
        
        return {
            addOptionItem: formGroupChunk.addOptionItem,
            deleteOptionItem: formGroupChunk.deleteOptionItem,
            addConditionLine: formGroupChunk.addConditionLine,
            modelChange: formGroupChunk.modelChange,
            conditionValueChange: formGroupChunk.conditionValueChange,
            groupNameChange: formGroupChunk.groupNameChange,
            delConditionLine: formGroupChunk.delConditionLine,
        }
    }
})
</script>

<style scoped lang="scss">
.VGroup {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: #33D0FF;
    margin-bottom: 16px;
    border-radius: 8px;
    &>.top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &>.left {
        
        }
        &>.right {
        
        }
    }
    .formItemsDiv {
        display: flex;
        flex-direction: column;
    }
}
</style>