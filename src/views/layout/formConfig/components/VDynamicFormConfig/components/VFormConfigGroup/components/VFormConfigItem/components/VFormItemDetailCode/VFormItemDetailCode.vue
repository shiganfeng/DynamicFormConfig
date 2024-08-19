<template>
    <a-form-item
        label="表单项业务标识"
        :name="[...formItemIndexes, 'detailCode']"
        :rules="formItemDetailCodeRule"
    >
        <a-input
            :value="detailCode"
            :disabled="disabledDetailCodeChunk.disabled.value"
            placeholder="请输入"
            @update:value="detailCodeChange"
            @focus="disabledDetailCodeChunk.onFocus"
            @blur="disabledDetailCodeChunk.onBlur"
        />
    </a-form-item>
</template>


<script>
import { computed, defineComponent, nextTick, ref } from "vue";

export default defineComponent({
    props: {
        formItemIndexes: {
            type: Array,
            required: true,
            default: () => ([]),
        },
        detailCode: {
            type: String,
            default: '',
        },
        depend: {
            type: Object,
            default: () => ({
                effectMethodTypeDependMap: new Map(),
                allFlatMethodTypeParams: new Set(),
            }),
        },
        allCode: {
            type: Object,
            default: () => ({
                allGroupCodeSet: new Set(),
                allGroupCodeArray: [],
                allFormItemDetailCodeFlatSet: new Set(),
                allFormItemDetailCodeFlatArray: [],
                allGroupFormItemDetailCodeMap: new Map(),
                allGroupFormItemDetailCodeArrayMap: new Map(),
            }),
        },
    },
    emits: [
        'update:detailCode',
    ],
    setup(props, ctx) {
        // 是否被依赖
        const isByEffect = computed(() => {
            return props.depend.allFlatMethodTypeParamsSet.has(props.detailCode);
        });
        // 是否重复
        const isDuplication = computed(() => {
            const arr = props.allCode.allFormItemDetailCodeFlatArray;
            const length = arr.length;
            let n = 0;
            for (let i = 0; i < length; i++) {
                const forCurrentValue = arr[i];
                if (forCurrentValue === props.detailCode) {
                    n++;
                    if (n >= 2) {
                        break;
                    }
                }
            }
            return n >= 2;
        });
        const formItemDetailCodeRule = [
            {
                validator:  async (_rule, value) => {
                    // 等待 allFormItemDetailCodeFlatArray、detailCode 赋值完成。
                    await nextTick();
                    if(value !== 0) {
                        value = (value || '').trim();
                    }
                    if (value === '') {
                        return Promise.reject('表单项业务标识必填');
                    } else {
                        if (isDuplication.value) {
                            return Promise.reject('表单项业务标识不可以重复');
                        } else if (disabledDetailCodeChunk.writing.value && isByEffect.value) {
                            return Promise.reject('标识被依赖,失焦点后将被禁用');
                        }
                    }
                },
                required: true,
                trigger: 'change',
            }
        ];
        const disabledDetailCodeChunk = (() => {
            const writing = ref(false);
            const onFocus = () => {
                writing.value = true;
            };
            const onBlur = () => {
                writing.value = false;
            };
            const disabled = computed(() => {
                return !writing.value && !isDuplication.value && isByEffect.value;
            });
            return {
                writing,
                onFocus,
                onBlur,
                disabled,
            }
        })();
        const detailCodeChange = (value) => {
            ctx.emit('update:detailCode', value);
        };
        return {
            formItemDetailCodeRule,
            disabledDetailCodeChunk,
            detailCodeChange,
        }
    }
});
</script>
