<template>
    <div class="formConfig">
        <div class="left">
            <div
                v-for="item in formMenu"
                :key="item.id"
                class="menuItem"
                :class="{active: activeFormId === item.id}"
                @click="formItemClick(item.id)"
            >
                {{item.formName}}
            </div>
        </div>
        <div class="right">
            <VDynamicFormConfig
                ref="VDynamicFormConfigRef"
                :disabled="!activeFormId"
                :dynamicFormStruct="dynamicFormStruct"
                :methodTypeParamsOptions="methodTypeParamsOptions"
                :depend="depend"
                :allCode="allCode"
                :allkey="allKey"
                :folds="folds"
                :isFoldAllGroup="isFoldAllGroup"
                :isFoldAllFormItem="isFoldAllFormItem"
                :isFoldAllGroupFormItemKeyMap="isFoldAllGroupFormItemKeyMap"
                @foldOrUnFoldAllGroupClick="foldOrUnFoldAllGroupClick"
                @foldOrUnFoldAllFormItemClick="foldOrUnFoldAllFormItemClick"
                @foldOrUnGroupClick="foldOrUnGroupClick"
                @foldOrUnGroupAllFormItemClick="foldOrUnGroupAllFormItemClick"
                @foldOrUnFoldFormItemClick="foldOrUnFoldFormItemClick"
                @addGroup="addGroup"
                @subGroup="subGroup"
                @removeFromItemClick="removeFromItemClick"
                @addFormItem="addFormItem"
                @methodTypeChange="methodTypeChange"
                @submit="submit"
            ></VDynamicFormConfig>
        </div>
    </div>
</template>

<script>
import dfs from './dfs.js';
import {mockData} from "./mockData.js";
import {Modal} from "ant-design-vue";
import {computed, defineComponent, ref} from "vue";
import VDynamicFormConfig from "./components/VDynamicFormConfig/VDynamicFormConfig.vue";

export default defineComponent({
    components: {
        VDynamicFormConfig
    },
    setup() {
        const formMenuChunk = (() => {
            const activeFormId = ref('');
            const formMenu = ref([
                // {
                //     id: '',
                //     formName: '',
                //     formCode: ''
                // },
            ]);
            
            const queryFormMenu = async () => {
                const res = await new Promise((resolve) => {
                    resolve([
                        {
                            id: 'menu1',
                            formName: '测试表单',
                            formCode: 'testMenu'
                        }
                    ])
                });
                formMenu.value = res || [];
            };
            
            const formItemClick = (id) => {
                console.log('点击左侧某个表单项:', id);
                activeFormId.value = id;
                // OOTD 查询右侧表单配置数据
                dynamicFormStructChunk.queryFormData();
            };
            return {
                activeFormId,
                formMenu,
                queryFormMenu,
                formItemClick
            };
        })();
        
        const dynamicFormStructChunk = (() => {
            const VDynamicFormConfigRef = ref(null);
            const dynamicFormStruct = ref(dfs.createDynamicForm());
            const methodTypeParamsOptions = computed(() => {
                return dynamicFormStruct.value.formStruct.groups.filter(g => {
                    const formItemsIsNormal = g.groupStruct.formItems.find(formItem => {
                        return formItem.detailCode && formItem.detailName;
                    });
                    return g.groupCode && g.groupName && formItemsIsNormal;
                }).map(g => {
                    return {
                        ...g,
                        groupStruct: {
                            ...g.groupStruct,
                            formItems: g.groupStruct.formItems.filter(formItem => {
                                return formItem.detailCode && formItem.detailName;
                            })
                        }
                    };
                });
            });
            // 创建依赖项Map
            const depend = computed(() => {
                return dfs.createEffectMethodTypeDepend(dynamicFormStruct.value);
            });
            // 创建所有组的groupCode,所有表单项的detailCode的集合
            const allCode = computed(() => {
                return dfs.createAllCode(dynamicFormStruct.value);
            });
            const methodTypeChange = (formItem, methodType) => {
                console.log('methodType:', methodType);
                const config = formItem.formItemStruct.config;
                config.sourceMethod.methodType = methodType;
                config.disabled = dfs.valueSourceDictControlInfoMap[methodType].client_formItemDefaultDisabled;
                config.required = dfs.valueSourceDictControlInfoMap[methodType].client_formItemDefaultRequired;
                config.sourceMethod = dfs.createFormItemConfigSourceMethod({
                    methodType,
                });
            };
            // 查询右侧的表单结构
            const queryFormData = async () => {
                dynamicFormStruct.value = await new Promise((resolve) => {
                    resolve(JSON.parse(JSON.stringify(mockData)));
                });
                console.log('右侧表单的数据：', dynamicFormStruct.value);
                console.log('methodTypeParamsOptions:', methodTypeParamsOptions.value);
            }
            const addGroup = () => {
                dynamicFormStruct.value.formStruct.groups.push(dfs.createGroup());
            };
            const subGroup = async (groupIndex) => {
                const affirm = await new Promise((resolve) => {
                    Modal.confirm({
                        content: '确定要删除这个组吗？',
                        onOk: () => resolve(true),
                        onCancel: () => resolve(false)
                    })
                })
                if (!affirm) return;
                const groups = dynamicFormStruct.value.formStruct.groups;
                groups.splice(groupIndex, 1);
            };
            const addFormItem = (group) => {
                group.groupStruct.formItems.push(dfs.createFormItem());
            };
            const removeFromItemClick = async (group, formItemIndex) => {
                const affirm = await new Promise((resolve) => {
                    Modal.confirm({
                        content: '确定要删除这个表单项吗？',
                        onOk: () => resolve(true),
                        onCancel: () => resolve(false)
                    })
                })
                if (!affirm) return;
                group.groupStruct.formItems.splice(formItemIndex, 1);
            };
            const submit = async () => {
                console.log('submit');
                await VDynamicFormConfigRef.value.modalFormRef.validateFields();
                console.log('表单校验通过');
            };
            
            // 用来实现折叠/展开的chunk
            const foldOrUnFold = (() => {
                // 所有折叠的元素（包括组和组内项）的uniqueKey平铺
                const folds = ref(new Set());
                /**
                 * @description 所有的 uniqueKey 变量
                 */
                const allKey = computed(() => {
                    return dfs.createAllUniqueKey(dynamicFormStruct.value);
                });
                
                /**
                 * @description 是否折叠了全部的组
                 */
                const isFoldAllGroup = computed(() => {
                    let flag = true;
                    // 所有组的uniqueKey集合
                    const allGroupKeys = allKey.value.allGroupUniqueKeySet;
                    for(const key of allGroupKeys) {
                        if (!folds.value.has(key)) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                });
                
                /**
                 * @description 是否折叠了所有的组内的表单项
                 */
                const isFoldAllFormItem = computed(() => {
                    let flag = true;
                    // 所有组内的的表单项的uniqueKey的集合
                    let allFormItemKeys = allKey.value.allFormItemUniqueKeyFlatSet;
                    for(const key of allFormItemKeys) {
                        if (!folds.value.has(key)) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                });
                
                /**
                 * @description 是否折叠了某个组内的所有表单项 形成Map
                 */
                const isFoldAllGroupFormItemKeyMap = computed(() => {
                    const targetMap = new Map();
                    const keyMap = allKey.value.allGroupFormItemUniqueKeyMap;
                    for(const [groupUniqueKey, groupFormItemKeys] of keyMap) {
                        let flag = true;
                        for(const key of groupFormItemKeys) {
                            if (!folds.value.has(key)) {
                                flag = false;
                                break;
                            }
                        }
                        targetMap.set(groupUniqueKey, flag);
                    }
                    return targetMap;
                });
                
                /**
                 * @description 折叠或展开所有的 分组。
                 * */
                const foldOrUnFoldAllGroupClick = () => {
                    console.log('是否折叠了所有组：', isFoldAllGroup.value);
                    if (isFoldAllGroup.value) {
                        // 展开
                        allKey.value.allGroupUniqueKeySet.forEach(groupUniqueKey => {
                            folds.value.delete(groupUniqueKey);
                        })
                    } else {
                        // 折叠
                        allKey.value.allGroupUniqueKeySet.forEach(groupUniqueKey => {
                            folds.value.add(groupUniqueKey);
                        })
                    }
                };
                
                /**
                 * @description 折叠或展开所有 表单项
                 */
                const foldOrUnFoldAllFormItemClick = () => {
                    console.log('是否折叠了所有表单项：');
                    if (isFoldAllFormItem.value) {
                        // 展开
                        allKey.value.allFormItemUniqueKeyFlatSet.forEach(formItemUniqueKey => {
                            folds.value.delete(formItemUniqueKey);
                        })
                    } else {
                        // 折叠
                        allKey.value.allFormItemUniqueKeyFlatSet.forEach(formItemUniqueKey => {
                            folds.value.add(formItemUniqueKey);
                        })
                    }
                };
                
                /**
                 * @description 折叠或展开某个分组
                 */
                const foldOrUnGroupClick = (groupUniqueKey) => {
                    console.log('折叠或展开某个分组');
                    if (folds.value.has(groupUniqueKey)) {
                        // 展开
                        folds.value.delete(groupUniqueKey);
                    } else {
                        // 折叠
                        folds.value.add(groupUniqueKey);
                    }
                }
                
                /**
                 * @description 折叠或展开当前组内的所有表单项
                 */
                const foldOrUnGroupAllFormItemClick = (groupUniqueKey) => {
                    console.log('折叠或展开某个分组内的所有表单项');
                    const isFold = isFoldAllGroupFormItemKeyMap.value.get(groupUniqueKey);
                    if (isFold) {
                        // 展开
                        allKey.value.allGroupFormItemUniqueKeyMap.get(groupUniqueKey).forEach(formItemUniqueKey => {
                            folds.value.delete(formItemUniqueKey);
                        })
                    } else {
                        // 折叠
                        allKey.value.allGroupFormItemUniqueKeyMap.get(groupUniqueKey).forEach(formItemUniqueKey => {
                            folds.value.add(formItemUniqueKey);
                        })
                    }
                }
                
                /**
                 * @description 折叠或展开当前表单项。
                 * */
                const foldOrUnFoldFormItemClick = (formItemUniqueKey) => {
                    if (folds.value.has(formItemUniqueKey)) {
                        // 展开
                        folds.value.delete(formItemUniqueKey);
                    } else {
                        // 折叠
                        folds.value.add(formItemUniqueKey);
                    }
                };
                
                return {
                    folds,
                    allKey,
                    isFoldAllGroup,
                    isFoldAllFormItem,
                    isFoldAllGroupFormItemKeyMap,
                    foldOrUnFoldAllGroupClick,
                    foldOrUnFoldAllFormItemClick,
                    foldOrUnGroupClick,
                    foldOrUnGroupAllFormItemClick,
                    foldOrUnFoldFormItemClick
                }
            })();
            
            return {
                VDynamicFormConfigRef,
                dynamicFormStruct,
                methodTypeParamsOptions,
                depend,
                allCode,
                foldOrUnFold,
                queryFormData,
                addGroup,
                subGroup,
                removeFromItemClick,
                addFormItem,
                submit,
                methodTypeChange,
            }
        })();
        const init = () => {
            console.log('init');
            formMenuChunk.queryFormMenu();
        };
        init();
        
        return {
            activeFormId: formMenuChunk.activeFormId,
            formMenu: formMenuChunk.formMenu,
            queryFormMenu: formMenuChunk.queryFormMenu,
            formItemClick: formMenuChunk.formItemClick,
            VDynamicFormConfigRef: dynamicFormStructChunk.VDynamicFormConfigRef,
            dynamicFormStruct: dynamicFormStructChunk.dynamicFormStruct,
            methodTypeParamsOptions: dynamicFormStructChunk.methodTypeParamsOptions,
            depend: dynamicFormStructChunk.depend,
            allCode: dynamicFormStructChunk.allCode,
            queryFormData: dynamicFormStructChunk.queryFormData,
            addGroup: dynamicFormStructChunk.addGroup,
            subGroup: dynamicFormStructChunk.subGroup,
            removeFromItemClick: dynamicFormStructChunk.removeFromItemClick,
            addFormItem: dynamicFormStructChunk.addFormItem,
            submit: dynamicFormStructChunk.submit,
            methodTypeChange: dynamicFormStructChunk.methodTypeChange,
            folds: dynamicFormStructChunk.foldOrUnFold.folds,
            allKey: dynamicFormStructChunk.foldOrUnFold.allKey,
            isFoldAllGroup: dynamicFormStructChunk.foldOrUnFold.isFoldAllGroup,
            isFoldAllFormItem: dynamicFormStructChunk.foldOrUnFold.isFoldAllFormItem,
            isFoldAllGroupFormItemKeyMap: dynamicFormStructChunk.foldOrUnFold.isFoldAllGroupFormItemKeyMap,
            foldOrUnFoldAllGroupClick: dynamicFormStructChunk.foldOrUnFold.foldOrUnFoldAllGroupClick,
            foldOrUnFoldAllFormItemClick: dynamicFormStructChunk.foldOrUnFold.foldOrUnFoldAllFormItemClick,
            foldOrUnGroupClick: dynamicFormStructChunk.foldOrUnFold.foldOrUnGroupClick,
            foldOrUnGroupAllFormItemClick: dynamicFormStructChunk.foldOrUnFold.foldOrUnGroupAllFormItemClick,
            foldOrUnFoldFormItemClick: dynamicFormStructChunk.foldOrUnFold.foldOrUnFoldFormItemClick,
        }
    }
})
</script>

<style scoped lang="scss">
.formConfig {
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    background-color: #F4F7FC;
    font-size: 14px;
    &>.left {
        height: 100%;
        width: 300px;
        flex: none;
        overflow-y: auto;
        margin-right: 16px;
        background-color: #ffffff;
        padding: 8px;
        display: flex;
        flex-direction: column;
        &>.menuItem {
            width: 100%;
            height: 40px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: solid 1px #BFBFBF;
            cursor: pointer;
            border-radius: 8px;
            &.active, &:hover {
                background-color: rgba(47, 84, 235, 0.1);
                border-color: #2F54EB;
            }
        }
    }
    &>.right {
        height: 100%;
        width: 0;
        flex: 1 0 auto;
        overflow-y: auto;
        background-color: #ffffff;
        padding: 8px;
    }
}
</style>