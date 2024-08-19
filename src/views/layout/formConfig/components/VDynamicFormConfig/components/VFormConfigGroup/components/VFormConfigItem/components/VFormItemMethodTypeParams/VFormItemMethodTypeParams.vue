<template>
    <a-form-item
        label="表单项数据来源方式参数"
        :name="[...formItemIndexes, 'formItemStruct', 'config', 'sourceMethod', 'methodTypeParams']"
        :rules="methodTypeParamsRules"
    
    >
        <!-- ......!    isFocus，如果这里找个地方绑定的话，下面的 disabled 不触发更新 -->
        <a-select
            :abcdefg="isFocus"
            :value="methodTypeParams"
            mode="multiple"
            @update:value="methodTypeParamsChange"
            @focus="selectOnFocus"
            @blur="selectOnBlur"
        >
            <a-select-opt-group
                v-for="group in methodTypeParamsOptions"
                :key="group.groupCode"
            >
                <template #label>
                    <div>{{ group.groupName }}</div>
                </template>
                <a-select-option
                    v-for="item in group.groupStruct.formItems"
                    :key="item.detailCode"
                    :value="item.detailCode"
                    :disabled="isFocus && disabledMethodTypeParamsOptionFun(item.detailCode)"
                >{{ item.detailName }}</a-select-option>
            </a-select-opt-group>
        </a-select>
    </a-form-item>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import dfs from "../../../../../../../../dfs.js";

export default defineComponent({
    props: {
        formItemIndexes: {
            type: Array,
            required: true,
            default: () => ([]),
        },
        methodTypeParams: {
            type: Array,
            default: () => ([
                // String
            ]),
        },
        methodTypeParamsOptions: {
            type: Array,
            default: () => ([
                // dfs.createGroup()
            ])
        },
        methodType: {
            type: String,
            default: '',
            required: true,
        },
        detailCode: {
            type: String,
            default: '',
            required: true,
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
        'update:methodTypeParams',
    ],
    setup(props, ctx) {
        const isFocus = ref(false);
        const selectOnFocus = function() {
            isFocus.value = true;
        };
        const selectOnBlur = function() {
            isFocus.value = false;
        };


        const disabledMethodTypeParamsOptionFun = (() => {
            /**
             * @description 禁止选择：[依赖当前表单项的表单项、自身]。
             * */
            const methodTypeParamsOptionsDisabledCodesSet = computed(() => {
                const target = new Set();
                const currentDetailCode = props.detailCode;
                // 自身
                target.add(currentDetailCode);
                const effectMethodTypeDependMap = props.depend.effectMethodTypeDependMap;

                const list = [currentDetailCode];

                // 防止：如果数据是环形的，导致此代码进入死循环。
                const alreadyFind = new Set();
                // 依赖当前表单项的表单项，及其整条依赖线
                while (list.length) {
                    const detailCode = list.shift();
                    if (alreadyFind.has(detailCode)) {
                        continue;
                    } else {
                        alreadyFind.add(detailCode);
                    }
                    let effect = effectMethodTypeDependMap.get(detailCode);
                    if (effect) {
                        effect.forEach((code) => {
                            target.add(code);
                            list.push(code);
                        });
                    }
                }
                return target;
            });

            return (detailCode) => {
                // [依赖当前表单项的表单项、自身] 这个集合里面是否包含了detailCode
                const effectCurrent = methodTypeParamsOptionsDisabledCodesSet.value.has(detailCode);
                const selectMax = dfs.valueSourceDictControlInfoMap[props.methodType].config_allowSelectMethodTypeParamsNumber;
                // 是否已经选满。除非有旧数据，不然 selectMax 不可能小于 length。
                const filled = selectMax <= props.methodTypeParams.length;
                // 是否是 尚未选中的选项。
                const notSelected = !props.methodTypeParams.includes(detailCode);
                return effectCurrent || (filled && notSelected);
            }
        })();
        // 是否选择了意料之外的值（一般是表单项A被别的表单项当作依赖选择了以后，用户把表单项A的配置整个删除了）
        const isHasUnexpectedly = computed(() => {
            const allFormItemDetailCodeFlatSet = props.allCode.allFormItemDetailCodeFlatSet;
            return props.methodTypeParams.some(mtp => {
                return !allFormItemDetailCodeFlatSet.has(mtp);
            });
        });
        const methodTypeParamsRules = computed(() => {
            return [
                {
                    required: true,
                    validator: (_rule, value) => {
                        if (value.length === 0) {
                            return Promise.reject('表单项数据来源方式参数必填');
                        } else if (isHasUnexpectedly.value) {
                            return Promise.reject('选择了不存在的参数');
                        } else {
                            return Promise.resolve();
                        }
                    },
                    trigger: 'change'
                },
            ];
        });
        const methodTypeParamsChange = (value) => {
            ctx.emit('update:methodTypeParams', value);
        };
        return {
            disabledMethodTypeParamsOptionFun,
            methodTypeParamsRules,
            methodTypeParamsChange,
            isFocus,
            selectOnFocus,
            selectOnBlur,
        }
    }
});
</script>
