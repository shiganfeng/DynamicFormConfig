<template>
    <div class="VGroup">
        <div class="top">
            <div class="title">{{group.groupName}}</div>
        </div>
        <VFormItem
            v-for="formItem in group.formItems"
            :key="formItem.formItemKey"
            :formItem="formItem"
            :formItemSelectArr="formItemSelectArr"
            :formItemTypeMap="formItemTypeMap"
            :formItemIsShowMap="formItemIsShowMap"
            v-model:label="formItem.label"
            v-model:type="formItem.type"
            v-model:required="formItem.required"
            v-model:message="formItem.message"
            v-model:options="formItem.formItemStruct.options"
            v-model:relation="formItem.conditionStruct.relation"
            @addOptionItem="(optionItem) => addOptionItem(formItem, optionItem)"
            @deleteOptionItem="(itemIndex) => deleteOptionItem(formItem, itemIndex)"
            @addFormStructLine="addFormStructLine(formItem)"
            @modelChange="modelChange"
            @conditionValueChange="conditionValueChange"
        ></VFormItem>
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
        formItemIsShowMap: {
            type: Map,
            default: () => (new Map())
        }
    },
    emits: [
        'addOptionItem',
        'deleteOptionItem',
        'addFormStructLine',
        'modelChange',
        'conditionValueChange'
    ],
    setup(props, ctx) {
        const formGroupChunk = (() => {
            const addOptionItem = (formItem, optionItem) => {
                ctx.emit('addOptionItem', formItem, optionItem);
            }
            const deleteOptionItem = (formItem, itemIndex) => {
                ctx.emit('deleteOptionItem', formItem, itemIndex);
            }
            const addFormStructLine = (formItem) => {
                ctx.emit('addFormStructLine', formItem);
            };
            const modelChange = (conditionLine, value) => {
                ctx.emit('modelChange', conditionLine, value);
            };
            const conditionValueChange = (conditionLine, value) => {
                ctx.emit('conditionValueChange', conditionLine, value);
            }
            return {
                addOptionItem,
                deleteOptionItem,
                addFormStructLine,
                modelChange,
                conditionValueChange
            }
        })();
        
        return {
            addOptionItem: formGroupChunk.addOptionItem,
            deleteOptionItem: formGroupChunk.deleteOptionItem,
            addFormStructLine: formGroupChunk.addFormStructLine,
            modelChange: formGroupChunk.modelChange,
            conditionValueChange: formGroupChunk.conditionValueChange,
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
        margin-bottom: 16px;
        &>.title {
            color: #9433FF;
            font-weight: bold;
        }
    }
}
</style>