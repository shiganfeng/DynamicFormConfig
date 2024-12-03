<template>
    <div class="questionConfig">
        <div class="formCon">
            <VForm
                ref="VFormRef"
                :formStruct="formStruct"
                :formItemSelectArr="formOptionsGroups.formItemSelectArr"
                :formItemTypeMap="formOptionsGroups.formItemTypeMap"
                :allFormItemCodeArr="formOptionsGroups.allFormItemCodeArr"
                @addOptionItem="addOptionItem"
                @deleteOptionItem="deleteOptionItem"
                @addConditionLine="addConditionLine"
                @delConditionLine="delConditionLine"
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
import { ref, defineComponent, computed, watch } from "vue";
import formConfig from "../../../../test/formConfig.vue";
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
            const VFormRef = ref(null)
            const formStruct = ref(JSON.parse(JSON.stringify(mockData)));
            console.log('formStruct:', formStruct.value);
            // const formOptionsGroups = ref({
            //     formItemTypeMap: new Map(),
            //     formItemSelectArr: [],
            //     allFormItemCodeArr: []
            // })
            const formOptionsGroups = computed(() => {
                console.log('formStruct.value：：：：||||||||', formStruct.value)
                return createFormItemMap(formStruct.value);
            })
            // console.log('formOptionsGroups:', formOptionsGroups.value)
            // watch(() => formStruct.value, () => {
            //     console.log('formStruct:', formStruct.value);
            //     console.log('formOptionsGroups44444:', formOptionsGroups.value)
            //     formOptionsGroups.value = createFormItemMap(formStruct.value);
            // }, {
            //     deep: true,
            //     immediate: true
            // })
            const addOptionItem = (formItem, optionItem) => {
                formItem.formItemStruct.options.push(optionItem);
            };
            const deleteOptionItem = (formItem, itemIndex) => {
                formItem.formItemStruct.options.splice(itemIndex, 1);
            };
            const addConditionLine = (formItem) => {
                console.log(formItem);
                formItem.conditionStruct.conditionList.push(createConditionLine());
            };
            const delConditionLine = (formItem, conditionLineIndex) => {
                formItem.conditionStruct.conditionList.splice(conditionLineIndex, 1);
            };
            const modelChange = (conditionLine, value) => {
                conditionLine.model = value;
                conditionLine.modelType = formOptionsGroups.value.formItemTypeMap.get(value).type;
                conditionLine.modelMiddleUse = formOptionsGroups.value.formItemTypeMap.get(value).isMiddleUse;
            };
            const conditionValueChange = (conditionLine, value) => {
                conditionLine.conditionValue = value;
            };
            const saveForm = async () => {
                console.log(formStruct.value);
                const validateRes = await VFormRef.value.modelFormRef.validateFields();
                if (validateRes) {
                    updateMockData(formStruct.value);
                    message.success('保存成功！');
                } else {
                    message.error('校验失败！');
                }
            };
            const goForm = () => {
                router.push({
                    name: 'question'
                });
            };
            return {
                VFormRef,
                formStruct,
                formOptionsGroups,
                addOptionItem,
                deleteOptionItem,
                addConditionLine,
                delConditionLine,
                modelChange,
                conditionValueChange,
                saveForm,
                goForm
            }
        })()
        
        return {
            VFormRef: formConfigChunk.VFormRef,
            formStruct: formConfigChunk.formStruct,
            formOptionsGroups: formConfigChunk.formOptionsGroups,
            addOptionItem: formConfigChunk.addOptionItem,
            deleteOptionItem: formConfigChunk.deleteOptionItem,
            addConditionLine: formConfigChunk.addConditionLine,
            delConditionLine: formConfigChunk.delConditionLine,
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