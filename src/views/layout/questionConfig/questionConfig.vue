<template>
    <div class="questionConfig">
        <div class="formCon">
            <VForm
                :formStruct="formStruct"
                :formItemSelectArr="formItemSelectArr"
                :formItemTypeMap="formItemTypeMap"
                :formItemIsShowMap="formItemIsShowMap"
                @addOptionItem="addOptionItem"
                @deleteOptionItem="deleteOptionItem"
                @addFormStructLine="addFormStructLine"
                @modelChange="modelChange"
                @conditionValueChange="conditionValueChange"
            ></VForm>
        </div>
        <div class="bottom">
            <a-button @click="goForm" type="primary">表单显示</a-button>
            <a-button @click="saveForm" type="primary">保存</a-button>
        </div>
    </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import VForm from "./components/VForm/VForm.vue";
import { useRouter } from "vue-router";
import { mockData, createFormItemMap, updateMockData, createConditionLine } from "./mockData.js";
import {message} from "ant-design-vue";

export default defineComponent({
    components: {
        VForm
    },
    setup() {
        const router = useRouter();
        const formConfigChunk = (() => {
            const formStruct = ref(JSON.parse(JSON.stringify(mockData)));
            const formOptionsGroups = computed(() => {
                return createFormItemMap(formStruct.value);
            })
            console.log(formOptionsGroups.value)
            const addOptionItem = (formItem, optionItem) => {
                formItem.formItemStruct.options.push(optionItem);
            };
            const deleteOptionItem = (formItem, itemIndex) => {
                formItem.formItemStruct.options.splice(itemIndex, 1);
            };
            const addFormStructLine = (formItem) => {
                console.log(formItem);
                formItem.conditionStruct.conditionList.push(createConditionLine());
            };
            const modelChange = (conditionLine, value) => {
                conditionLine.model = value;
                conditionLine.modelType = formOptionsGroups.value.formItemTypeMap.get(value).type;
            };
            const conditionValueChange = (conditionLine, value) => {
                conditionLine.conditionValue = value;
            };
            const saveForm = () => {
                console.log(formStruct.value);
                updateMockData(formStruct.value);
                message.success('保存成功！');
            };
            const goForm = () => {
                router.push({
                    name: 'question'
                });
            };
            return {
                formStruct,
                formOptionsGroups,
                addOptionItem,
                deleteOptionItem,
                addFormStructLine,
                modelChange,
                conditionValueChange,
                saveForm,
                goForm
            }
        })()
        
        return {
            formStruct: formConfigChunk.formStruct,
            formItemSelectArr: formConfigChunk.formOptionsGroups.value.formItemSelectArr,
            formItemTypeMap: formConfigChunk.formOptionsGroups.value.formItemTypeMap,
            formItemIsShowMap: formConfigChunk.formOptionsGroups.value.formItemIsShowMap,
            addOptionItem: formConfigChunk.addOptionItem,
            deleteOptionItem: formConfigChunk.deleteOptionItem,
            addFormStructLine: formConfigChunk.addFormStructLine,
            modelChange: formConfigChunk.modelChange,
            conditionValueChange: formConfigChunk.conditionValueChange,
            saveForm: formConfigChunk.saveForm,
            goForm: formConfigChunk.goForm,
        }
    }
})
</script>

<style scoped lang="scss">
.questionConfig {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #DAF7A6;
    &>.formCon {
        width: 100%;
        height: 0;
        flex: 1 0 auto;
    }
    &>.bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 8px;
        gap: 16px;
    }
}

</style>