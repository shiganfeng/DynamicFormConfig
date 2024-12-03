<template>
    <div class="VForm">
        <a-form
            ref="modelFormRef"
            :disabled="disabled"
            :model="formStruct"
            :validate-messages="{ required: '${label}必填' }"
            layout="horizontal"
        >
            <VGroup
                v-for="(group, groupIndex) in formStruct.groups"
                :key="group.groupKey"
                :formItemIndexes="['groups', groupIndex]"
                :group="group"
                :groupIndex="groupIndex"
                :formItemSelectArr="formItemSelectArr"
                :allFormItemCodeArr="allFormItemCodeArr"
                :formItemTypeMap="formItemTypeMap"
                v-model:groupName="group.groupName"
                @addOptionItem="addOptionItem"
                @deleteOptionItem="deleteOptionItem"
                @addConditionLine="addConditionLine"
                @modelChange="modelChange"
                @conditionValueChange="conditionValueChange"
                @delConditionLine="delConditionLine"
            ></VGroup>
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
    },
    emits: [
        'addOptionItem',
        'deleteOptionItem',
        'addConditionLine',
        'modelChange',
        'conditionValueChange',
        'delConditionLine',
    ],
    setup(props, ctx) {
        const formChunk = (() => {
            const modelFormRef = ref(null);
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
}
</style>