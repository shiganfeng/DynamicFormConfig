<template>
    <div class="VQuestionFormItem">
        <div class="left">{{formItem.label}}</div>
        <div class="right">
            <component
                :is="formItem.type"
                :value="computeFormState[formItem.formItemKey].value"
                :options="formItem.formItemStruct.options"
                @update:value="(value) => updateOriginValue(formItem, value)"
            ></component>
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import VInput from "../../../VInput.vue";
import VCheckbox from "../../../VCheckbox.vue";
import VRadio from "../../../VRadio.vue";
import VDateTime from "../../../VDateTime.vue";
import VSingleSelect from "../../../VSingleSelect.vue";
import VMultipleSelect from "../../../VMultipleSelect.vue";
import VSwitch from "../../../VSwitch.vue";
import VNumber from "../../../VNumber.vue";
import VComputeText from "../../../VComputeText.vue";
import VPercent from "../../../VPercent.vue";
import VThousand from "../../../VThousand.vue";
import VQuestionGroup from "../../VQuestionGroup.vue";
export default defineComponent({
    components: {
        VInput,
        VCheckbox,
        VRadio,
        VDateTime,
        VSingleSelect,
        VMultipleSelect,
        VSwitch,
        VNumber,
        VComputeText,
        VPercent,
        VThousand,
    },
    props: {
        computeFormState: {
            type: Object,
            default: () => ({})
        },
        formItem: {
            type: Object,
            default: () => ({
                formItemKey: '', // 应该自动生成
                label: '', // 手动输入
                type: '', // 下拉选择组件
                required: true, // 校验是否必填
                message: '', // 校验时候的信息
                conditionStruct: {
                    relation: '&',
                    conditionList: [
                        {
                            conditionKey: '',
                            model: '', // 字段名（这里用的是formItemKey的值）
                            conditionValue: '', // 这个字段的值
                        }
                    ]
                },
                formItemStruct: {
                    options: []
                }
            })
        },
    },
    emits: [
        'updateOriginValue'
    ],
    setup(props, ctx) {
        const updateOriginValue = (formItem, value) => {
            ctx.emit('updateOriginValue', formItem, value);
        }
        return {
            updateOriginValue
        }
    }
})
</script>



<style scoped lang="scss">
.VQuestionFormItem {
    width: 100%;
    display: flex;
    min-height: 40px;
    border: solid 1px #e8e8e8;
    &>.left {
        height: 100%;
        width: 300px;
        flex: none;
        background-color: #fafafa;
        padding: 0 8px;
        display: flex;
        align-items: center;
        border-right: solid 1px #e8e8e8;
    }
    &>.right {
        height: 100%;
        width: 0;
        flex: 1 0 auto;
        background-color: #ffffff;
        padding: 0 8px;
        display: flex;
        align-items: center;
    }
}
</style>