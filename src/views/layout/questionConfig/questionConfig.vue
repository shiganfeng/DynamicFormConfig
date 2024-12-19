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
                :foldsKey="foldsKey"
                :isFoldAllInGroupFormItemKeyMap="isFoldAllInGroupFormItemKeyMap"
                :isFoldAllGroup="isFoldAllGroup"
                :isFoldAllFormItem="isFoldAllFormItem"
                @deleteFormItem="deleteFormItem"
                @addFormItem="addFormItem"
                @deleteGroup="deleteGroup"
                @addGroup="addGroup"
                @addOptionItem="addOptionItem"
                @deleteOptionItem="deleteOptionItem"
                @addConditionLine="addConditionLine"
                @delConditionLine="delConditionLine"
                @modelChange="modelChange"
                @conditionValueChange="conditionValueChange"
                @foldOrUnFoldFormItemClick="foldOrUnFoldFormItemClick"
                @foldOrUnFoldGroupClick="foldOrUnFoldGroupClick"
                @foldOrUnFoldGroupAllFormItemClick="foldOrUnFoldGroupAllFormItemClick"
                @foldOrUnFoldAllGroupClick="foldOrUnFoldAllGroupClick"
                @foldOrUnFoldAllFormItemClick="foldOrUnFoldAllFormItemClick"
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
    dynamicComponentType,
    createAllKey,
    createFormItem,
    createGroup
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
            const deleteFormItem = (group, formItemIndex) => {
                group.formItems.splice(formItemIndex, 1);
            };
            const addFormItem = (group) => {
                group.formItems.push(createFormItem());
            };
            const deleteGroup = (groupIndex) => {
                formStruct.value.groups.splice(groupIndex, 1);
            };
            const addGroup = () => {
                formStruct.value.groups.push(createGroup());
            };
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
                deleteFormItem,
                addFormItem,
                deleteGroup,
                addGroup,
                addOptionItem,
                deleteOptionItem,
                addConditionLine,
                delConditionLine,
                modelChange,
                conditionValueChange,
                saveForm,
                goForm
            }
        })();
        // 折叠chunk
        const foldOrUnFoldChunk = (() => {
            // 维护的折叠key
            const foldsKey = ref(new Set());
            // 以组的groupKey做为key，这个组内的所有表单项的formItemKey为值，形成Map
            const allKey = computed(() => {
                return createAllKey(formConfigChunk.formStruct.value);
            });
            // 是否折叠了所有的组
            const isFoldAllGroup = computed(() => {
                let flag = true;
                // 所有组的groupKey
                const allGroupKeySet = allKey.value.allGroupKeySet;
                // 使用for循环节省时间
                for(const key of allGroupKeySet) {
                    if (!foldsKey.value.has(key)) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            });
            // 展开或折叠某个组
            const foldOrUnFoldGroupClick = (groupKey) => {
                if (foldsKey.value.has(groupKey)) {
                    // 已折叠则展开
                    foldsKey.value.delete(groupKey);
                } else {
                    foldsKey.value.add(groupKey);
                }
            };
            // 展开或折叠所有组
            const foldOrUnFoldAllGroupClick = () => {
                console.log()
                if (!isFoldAllGroup.value) {
                    // 折叠
                    allKey.value.allGroupKeySet.forEach(groupKey => {
                        foldsKey.value.add(groupKey)
                    });
                } else {
                    // 展开
                    allKey.value.allGroupKeySet.forEach(groupKey => {
                        foldsKey.value.delete(groupKey)
                    });
                }
            };
            // 是否折叠了所有的表单项
            const isFoldAllFormItem = computed(() => {
                let flag = true;
                // 所有组的groupKey
                const allFormItemKeySet = allKey.value.allFormItemKeySet;
                // 使用for循环节省时间
                for(const key of allFormItemKeySet) {
                    if (!foldsKey.value.has(key)) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            });
            // 展开或折叠某个表单项
            const foldOrUnFoldFormItemClick = (formItemKey) => {
                console.log('foldOrUnFoldFormItemClick', formItemKey);
                if (foldsKey.value.has(formItemKey)) {
                    // 已折叠则展开
                    foldsKey.value.delete(formItemKey);
                } else {
                    foldsKey.value.add(formItemKey);
                }
                console.log('foldsKey', foldsKey.value);
            };
            // 展开或折叠所有表单项
            const foldOrUnFoldAllFormItemClick = () => {
                if (!isFoldAllFormItem.value) {
                    // 折叠
                    allKey.value.allFormItemKeySet.forEach(groupKey => {
                        foldsKey.value.add(groupKey)
                    });
                } else {
                    // 展开
                    allKey.value.allFormItemKeySet.forEach(groupKey => {
                        foldsKey.value.delete(groupKey)
                    });
                }
            };
            // 以每个组的groupKey为key，flag为值，标记这个组内的所有项是否都展开
            const isFoldAllInGroupFormItemKeyMap = computed(() => {
                const targetMap = new Map();
                const allGroupFormItemKeyMap = allKey.value.allGroupFormItemKeyMap;
                for(const [groupKey, currentGroupFormItemsKeySet] of allGroupFormItemKeyMap) {
                    let flag = true;
                    for(const key of currentGroupFormItemsKeySet) {
                        if (!foldsKey.value.has(key)) {
                            flag = false;
                            break;
                        }
                        targetMap.set(groupKey, flag);
                    }
                }
                return targetMap;
            });
            // 展开或折叠当前组内的所有表单项
            const foldOrUnFoldGroupAllFormItemClick = (groupKey) => {
                const isFold = isFoldAllInGroupFormItemKeyMap.value.get(groupKey);
                console.log('是否折叠了选中的某个组的所有表单项：', isFold);
                if (isFold) {
                    // 展开
                    allKey.value.allGroupFormItemKeyMap.get(groupKey).forEach(formItemKey => {
                        foldsKey.value.delete(formItemKey)
                    });
                } else {
                    // 折叠
                    allKey.value.allGroupFormItemKeyMap.get(groupKey).forEach(formItemKey => {
                        foldsKey.value.add(formItemKey)
                    });
                }
            };
            
            return {
                foldsKey,
                allKey,
                isFoldAllGroup,
                foldOrUnFoldGroupClick,
                foldOrUnFoldAllGroupClick,
                isFoldAllFormItem,
                foldOrUnFoldFormItemClick,
                foldOrUnFoldAllFormItemClick,
                isFoldAllInGroupFormItemKeyMap,
                foldOrUnFoldGroupAllFormItemClick
            }
        })();
        
        return {
            VFormRef: formConfigChunk.VFormRef,
            formStruct: formConfigChunk.formStruct,
            formOptionsGroups: formConfigChunk.formOptionsGroups,
            formItemMethodParamsDependMap: formConfigChunk.formItemMethodParamsDependMap,
            deleteFormItem: formConfigChunk.deleteFormItem,
            addFormItem: formConfigChunk.addFormItem,
            deleteGroup: formConfigChunk.deleteGroup,
            addGroup: formConfigChunk.addGroup,
            addOptionItem: formConfigChunk.addOptionItem,
            deleteOptionItem: formConfigChunk.deleteOptionItem,
            addConditionLine: formConfigChunk.addConditionLine,
            delConditionLine: formConfigChunk.delConditionLine,
            modelChange: formConfigChunk.modelChange,
            conditionValueChange: formConfigChunk.conditionValueChange,
            saveForm: formConfigChunk.saveForm,
            goForm: formConfigChunk.goForm,
            
            foldsKey: foldOrUnFoldChunk.foldsKey,
            allKey: foldOrUnFoldChunk.allKey,
            isFoldAllGroup: foldOrUnFoldChunk.isFoldAllGroup,
            foldOrUnFoldGroupClick: foldOrUnFoldChunk.foldOrUnFoldGroupClick,
            foldOrUnFoldAllGroupClick: foldOrUnFoldChunk.foldOrUnFoldAllGroupClick,
            isFoldAllFormItem: foldOrUnFoldChunk.isFoldAllFormItem,
            foldOrUnFoldFormItemClick: foldOrUnFoldChunk.foldOrUnFoldFormItemClick,
            foldOrUnFoldAllFormItemClick: foldOrUnFoldChunk.foldOrUnFoldAllFormItemClick,
            isFoldAllInGroupFormItemKeyMap: foldOrUnFoldChunk.isFoldAllInGroupFormItemKeyMap,
            foldOrUnFoldGroupAllFormItemClick: foldOrUnFoldChunk.foldOrUnFoldGroupAllFormItemClick,
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