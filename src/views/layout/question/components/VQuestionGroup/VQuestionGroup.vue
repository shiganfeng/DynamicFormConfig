<template>
    <div class="VQuestionGroup">
        <div class="title">{{group.groupName}}</div>
        <div class="content">
            <template v-for="formItem in group.formItems">
                <VQuestionFormItem
                    v-if="formItemIsShowMap.get(formItem.formItemKey) && formItem.isShow"
                    :key="formItem.formItemKey"
                    :formItem="formItem"
                    :computeFormState="computeFormState"
                    @updateOriginValue="updateOriginValue"
                ></VQuestionFormItem>
            </template>
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import VQuestionFormItem from "./components/VQuestionFormItem/VQuestionFormItem.vue";

export default defineComponent({
    components: {
        VQuestionFormItem
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
        computeFormState: {
           type: Object,
            default: () => ({})
        },
        formItemIsShowMap: {
            type: Map,
            default: () => (new Map())
        }
    },
    emits: [
        'updateOriginValue'
    ],
    setup(props, ctx) {
        const updateOriginValue = (formItemKey, value) => {
            ctx.emit('updateOriginValue', formItemKey, value);
        }
        return {
            updateOriginValue
        }
    }
})
</script>



<style scoped lang="scss">
.VQuestionGroup {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    &>.title {
        background-color: #f5f7fd;
        color: #3362cd;
        font-size: 16px;
        font-weight: bold;
        padding: 8px;
        border-left: 3px solid #3362cd;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 16px;
    }
    &>.content {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
}
</style>