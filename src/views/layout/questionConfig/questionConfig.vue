<template>
    <div class="questionConfig">
        <div class="formCon">
            <VForm
                ref="VFormRef"
                :formStruct="formStruct"
                :formItemSelectArr="formOptionsGroups.formItemSelectArr"
                :formItemTypeMap="formOptionsGroups.formItemTypeMap"
                :allFormItemCodeArr="formOptionsGroups.allFormItemCodeArr"
                :formItemMethodParamsDependMap="formItemMethodParamsDependMap"
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
import VForm from "./components/VForm/VForm.vue";
import { useRouter } from "vue-router";
import {
    mockData,
    createFormItemMap,
    createFormItemDependMap,
    updateMockData,
    createConditionLine,
    dynamicComponentType
} from "./mockData.js";
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
            });
            // 每一个表单项的计算依赖
            const formItemMethodParamsDependMap = computed(() => {
                return createFormItemDependMap(formStruct.value).formItemMethodParamsDependMap;
            });
            console.log('formItemMethodParamsDependMap---', formItemMethodParamsDependMap);
            
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
            const allConditionList = computed(() => {
                const arr = [];
                formStruct.value.groups.forEach(group => {
                    group.formItems.forEach(formItem => {
                        formItem.conditionStruct.conditionList.forEach(conditionItem => {
                            arr.push(conditionItem);
                        })
                    })
                })
                return arr;
            })
            console.log('allConditionList------:', allConditionList.value);
            const deleteOptionItem = (formItem, itemIndex) => {
                const optionLineCode = formItem.formItemStruct.options[itemIndex].code;
                console.log('optionLineCode', optionLineCode);
                formItem.formItemStruct.options.splice(itemIndex, 1);
                // 删除某一项（动态配置选择项）后，可能有其他的关联项选择了已删除的的值，需要清除掉
                console.log('deleteOptionItem', formStruct.value);
                // 方法一：计算属性-减少多层循环（借用了对象引用）
                // 方法二：可以用对象，但是代码量太大，暂时没写
                allConditionList.value.forEach(conditionItem => {
                    if(dynamicComponentType.includes(conditionItem.modelType)) {
                        switch (conditionItem.modelType) {
                            case 'VRadio': {
                                if (optionLineCode === conditionItem.conditionValue) {
                                    conditionItem.conditionValue = '';
                                }
                                break;
                            }
                            case 'VSingleSelect': {
                                if (optionLineCode === conditionItem.conditionValue) {
                                    conditionItem.conditionValue = '';
                                }
                                break;
                            }
                            case 'VCheckbox': {
                                if (conditionItem.conditionValue.includes(optionLineCode)) {
                                    const findIndex = conditionItem.conditionValue.findIndex(val => val === optionLineCode);
                                    conditionItem.conditionValue.splice(findIndex, 1);
                                }
                                break;
                            }
                            case 'VMultipleSelect': {
                                if (conditionItem.conditionValue.includes(optionLineCode)) {
                                    const findIndex = conditionItem.conditionValue.findIndex(val => val === optionLineCode);
                                    conditionItem.conditionValue.splice(findIndex, 1);
                                }
                            }
                        }
                    }
                })
            };
            const addConditionLine = (formItem) => {
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
                console.log('conditionLine', conditionLine);
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
                formItemMethodParamsDependMap,
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
            formItemMethodParamsDependMap: formConfigChunk.formItemMethodParamsDependMap,
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