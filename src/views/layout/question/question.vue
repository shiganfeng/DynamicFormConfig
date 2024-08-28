<template>
    <div class="question">
        <div class="formCon">
            <a-form
                ref="formRef"
                :model="formState"
                :rules="formRules"
            >
                <template
                    v-for="item in formFields"
                >
                    <a-form-item
                        v-if="checkCondition(item)"
                        :key="item.model"
                        :label="item.label"
                        :name="item.model"
                    >
                        <component
                            :is="item.type"
                            :value="formState[item.model]"
                            :options="item.options"
                            @update:value="(value) => updateValue(value, item.model)"
                        ></component>
                    </a-form-item>
                </template>
            </a-form>
        </div>
        <div class="bottom">
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref, computed} from "vue";
import VInput from "./components/VInput.vue";
import VCheckbox from "./components/VCheckbox.vue";
import VRadio from "./components/VRadio.vue";
import {message} from "ant-design-vue";
export default defineComponent({
    components: {
        VInput,
        VCheckbox,
        VRadio
    },
    setup() {
        const formChunk = (() => {
            const formWidth = ref({
                labelCol: { span: 2 },
                wrapperCol: { span: 13 },
            })
            const formRef = ref(null);
            // 表单配置结构（写死的数据，假如有配置页面，最后返回出来的数据该是这种结构）
            const formFields = ref([
                {
                    label: '编程语言',
                    type: 'VRadio',
                    model: 'language',
                    required: true,
                    message: '不为空',
                    condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
                        model: '', // 字段名
                        value: '', // 这个字段的值
                    },
                    options: [
                        {
                            label: 'JavaScript',
                            code: 'JavaScript'
                        },
                        {
                            label: 'Python',
                            code: 'Python'
                        },
                        {
                            label: 'Java',
                            code: 'Java'
                        },
                    ]
                },
                {
                    label: '擅长的前端框架',
                    type: 'VCheckbox',
                    model: 'frameworks',
                    required: true,
                    message: '不为空',
                    condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
                        model: '',
                        value: ''
                    },
                    options:[
                        {
                            label: 'Vue',
                            code: 'Vue'
                        },
                        {
                            label: 'React',
                            code: 'React'
                        },
                        {
                            label: 'Angular',
                            code: 'Angular'
                        }
                    ]
                },
                {
                    label: '编程语言的值为JavaScript时才显示',
                    type: 'VInput',
                    model:'opinion',
                    required: false,
                    message: '不为空',
                    condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
                        model: 'language',
                        value: 'JavaScript'
                    },
                    options: []
                },
                {
                    label: '擅长的前端框架的值为[Vue, React]时才显示',
                    type: 'VInput',
                    model:'tip',
                    required: true,
                    message: '不为空',
                    condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
                        model: 'frameworks',
                        value: ['Vue', 'React']
                    },
                    options: []
                },
            ]);
            // 表单绑定数据
            const formState = ref({});
            // 动态设置属性
            formFields.value.forEach(item => {
                formState.value[item.model] = item.type === 'VCheckbox' ? [] : '';
            })
            // 表单校验规则
            const formRules = computed(() => {
                const rules = {};
                formFields.value.forEach(item => {
                    rules[item.model] = {
                        required: item.required,
                        message: item.message,
                        trigger: 'change'
                    };
                });
                return rules;
            });
            const updateValue = (value, property) => {
                formState.value[property] = value;
                console.log(formState.value);
            }
            // 检查表单项的的显示条件
            const checkCondition = (item) => {
                const { condition: {
                    model,
                    value
                } } = item;
                console.log()
                if (!model) return true;
                if (typeof value === 'string') {
                    return formState.value[model] === value;
                } else if (Array.isArray(value)) {
                    return value.length === formState.value[model].length && value.every(item => formState.value[model].includes(item));
                }
            }
            const onSubmit = () => {
                formRef.value.validate().then(() => {
                    message.success('提交成功！');
                }).catch(() => {
                    message.error('提交失败!');
                })
            }
            
            return {
                formFields,
                formState,
                formRules,
                formRef,
                formWidth,
                
                updateValue,
                checkCondition,
                onSubmit
            }
        })();
        
        
        return {
            formFields: formChunk.formFields,
            formState: formChunk.formState,
            formRules: formChunk.formRules,
            formRef: formChunk.formRef,
            formWidth: formChunk.formWidth,
            
            updateValue: formChunk.updateValue,
            checkCondition: formChunk.checkCondition,
            onSubmit: formChunk.onSubmit,
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
    }
    &>.bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>