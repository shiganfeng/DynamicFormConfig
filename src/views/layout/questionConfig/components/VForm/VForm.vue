<template>
    <div class="VForm">
        <VGroup
            v-for="group in formStruct.groups"
            :key="group.groupKey"
            :group="group"
            :formItemSelectArr="formItemSelectArr"
            :formItemTypeMap="formItemTypeMap"
            :formItemIsShowMap="formItemIsShowMap"
            @addOptionItem="addOptionItem"
            @deleteOptionItem="deleteOptionItem"
            @addFormStructLine="addFormStructLine"
            @modelChange="modelChange"
            @conditionValueChange="conditionValueChange"
        ></VGroup>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import VGroup from "./components/VGroup/VGroup.vue";

export default defineComponent({
    components: {
        VGroup
    },
    props: {
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
        const formChunk = (() => {
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
            addOptionItem: formChunk.addOptionItem,
            deleteOptionItem: formChunk.deleteOptionItem,
            addFormStructLine: formChunk.addFormStructLine,
            modelChange: formChunk.modelChange,
            conditionValueChange: formChunk.conditionValueChange,
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