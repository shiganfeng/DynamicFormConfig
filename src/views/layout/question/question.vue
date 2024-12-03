<template>
    <div class="question">
        <div class="formCon">
            <VQuestionGroup
                v-for="group in formStruct.groups"
                :key="group.groupKey"
                :group="group"
                :computeFormState="computeFormState"
                :formItemIsShowMap="formItemIsShowMap"
                @updateOriginValue="updateOriginValue"
            ></VQuestionGroup>
        </div>
        <div class="bottom">
            <a-button type="primary" @click="onSubmit">提交</a-button>
            <a-button type="primary" @click="goFormConfig">表单配置</a-button>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref, computed} from "vue";
import { mockData,defaultConditionValueMap, computeIsShowFormItem, createFormItemMap } from "../questionConfig/mockData.js";
import VInput from "./components/VInput.vue";
import VCheckbox from "./components/VCheckbox.vue";
import VRadio from "./components/VRadio.vue";
import VDateTime from "./components/VDateTime.vue";
import VSingleSelect from "./components/VSingleSelect.vue";
import VMultipleSelect from "./components/VMultipleSelect.vue";
import VSwitch from "./components/VSwitch.vue";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import VQuestionGroup from "./components/VQuestionGroup/VQuestionGroup.vue";
export default defineComponent({
    components: {
        VInput,
        VCheckbox,
        VRadio,
        VDateTime,
        VSingleSelect,
        VMultipleSelect,
        VSwitch,
        VQuestionGroup
    },
    setup() {
        const router = useRouter();
        const formChunk = (() => {
            const formRef = ref(null);
            // 后端存储的表单数据
            const formData = ref([]);
            // 后端存储的表单结构
            const formStruct = ref({
                groups: []
            });
            // 后端存储的表单结构映射的表单项的Map
            const formOptionsGroups = computed(() => {
                return createFormItemMap(formStruct.value);
            })
            console.log('formOptionsGroups:', formOptionsGroups.value);
            // 表单显示的数据
            const computeFormState = computed(() => {
                const obj = {};
                formData.value.forEach(item => {
                    obj[item.formItemKey] = item;
                    // 不知道为啥就好了
                    void item.value;
                });
                return obj;
            });
            // 表单项是否显示的Map
            const formItemIsShowMap = computed(() => {
                console.log('formItemIsShowMap1111:', computeIsShowFormItem(formStruct.value, computeFormState.value, formOptionsGroups.value.formItemTypeMap).formItemIsShowMap)
                return computeIsShowFormItem(formStruct.value, computeFormState.value, formOptionsGroups.value.formItemTypeMap).formItemIsShowMap;
            });
            
            const queryFomStruct = async () => {
                formStruct.value = await new Promise((resolve) => {
                    resolve(JSON.parse(JSON.stringify(mockData)));
                });
                console.log('formStruct', formStruct.value);
            };
            const queryFormData = async () => {
                const res = await new Promise((resolve) => {
                    resolve(JSON.parse(JSON.stringify(mockData)));
                });
                if (res) {
                    const arr = [];
                    // 平铺所有的表单项
                    res.groups.forEach(group => {
                        group.formItems.forEach(formItem => {
                            arr.push({
                                formItemKey: formItem.formItemKey,
                                value: defaultConditionValueMap[formItem.type], // 初始化value值，不同组件类型绑定值类型不一样
                            });
                        })
                    });
                    formData.value = arr;
                    console.log('formData', formData.value);
                    console.log('computeFormState', computeFormState.value);
                }
            };
            const updateOriginValue = (formItemKey, value) => {
                // 对象引用
                computeFormState.value[formItemKey].value = value;
                console.log('computeFormState, ____', computeFormState.value);
                console.log('computeFormState, ++++', formData.value);
            }
            const onSubmit = () => {
                formRef.value.validate().then(() => {
                    message.success('提交成功！');
                }).catch(() => {
                    message.error('提交失败!');
                })
            }
            const goFormConfig = () => {
                router.push({
                    name: 'questionConfig'
                });
            }
            
            return {
                computeFormState,
                formItemIsShowMap,
                formRef,
                formData,
                formStruct,
                
                onSubmit,
                goFormConfig,
                queryFormData,
                queryFomStruct,
                updateOriginValue,
                
                
            }
        })();
        formChunk.queryFormData();
        formChunk.queryFomStruct();
        
        
        return {
            computeFormState: formChunk.computeFormState,
            formItemIsShowMap: formChunk.formItemIsShowMap,
            formRef: formChunk.formRef,
            formData: formChunk.formData,
            formStruct: formChunk.formStruct,
            
            onSubmit: formChunk.onSubmit,
            goFormConfig: formChunk.goFormConfig,
            updateOriginValue: formChunk.updateOriginValue,
            
        }
    }
})
</script>
<style scoped lang="scss">
.question {
    width: 100%;
    height: 100%;
    padding: 16px;
    background-color: #ffffff;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    &>.formCon {
        width: 100%;
        height: 0;
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
    }
    &>.bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
    }
}
</style>