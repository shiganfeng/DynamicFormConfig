<template>
    <div class="VFormConfigItem">
        <div class="baseInfo">
            <div class="container">
                <div class="item">
                    <a-form-item
                        label="表单项名称"
                        :name="[...formItemIndexes, 'detailName']"
                        :rules="[{ required: true }]"
                    >
                        <a-input
                            :value="detailName"
                            placeholder="请输入"
                            @update:value="detailNameChange"
                        />
                    </a-form-item>
                </div>
                
                <div class="item">
                    <VFormItemDetailCode
                        :formItemIndexes="formItemIndexes"
                        :detailCode="detailCode"
                        :depend="depend"
                        :allCode="allCode"
                        @update:detailCode="detailCodeChange"
                    />
                </div>
                <div class="item">
                    <a-form-item
                        label="备注"
                        :name="[...formItemIndexes, 'formItemStruct', 'postscript']"
                    >
                        <a-input
                            :value="postscript"
                            placeholder="请输入"
                            @update:value="postscriptChange"
                        />
                    </a-form-item>
                </div>
            </div>
            <div class="control">
                <VFoldToggleButton
                    :checkedValue="folds.has(formItem.uniqueKey)"
                    trueText="展开"
                    falseText="折叠"
                    @click="foldOrUnFoldFormItemClick"
                />
                <a-button danger @click="removeFromItemClick">删除</a-button>
                <div class="formItemDragButton">
                    <a-button type="primary">拖动</a-button>
                    <!--<SvgIcon name="drag" />-->
                </div>
            </div>
        </div>
        <div v-show="!folds.has(formItem.uniqueKey)" class="container">
            <div class="container">
                <div class="item">
                    <a-form-item
                        label="表单项控件类型"
                        :name="[...formItemIndexes, 'formItemStruct', 'config', 'formItemType']"
                        :rules="[{ required: true }]"
                    >
                        <a-select
                            :value="formItemType"
                            @update:value="formItemTypeChange"
                        >
                            <a-select-option
                                v-for="o in dfs.formItemDict"
                                :key="o.formItemType"
                                :value="o.formItemType"
                            >{{ o.formItemTypeName }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="item">
                    <a-form-item
                        label="表单项数据来源方式"
                        :name="[...formItemIndexes, 'formItemStruct', 'config', 'sourceMethod', 'methodType']"
                        :rules="[{ required: true }]"
                    >
                        <a-select
                            :value="methodType"
                            @update:value="methodTypeChange"
                        >
                            <a-select-option
                                v-for="o in dfs.valueSourceDict"
                                :key="o.methodType"
                                :value="o.methodType"
                            >{{ o.methodTypeName }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div
                    v-if="showMethodTypeParamsControl"
                    class="item"
                >
                    <VFormItemMethodTypeParams
                        :formItemIndexes="formItemIndexes"
                        :methodTypeParams="methodTypeParams"
                        :methodTypeParamsOptions="methodTypeParamsOptions"
                        :methodType="methodType"
                        :detailCode="detailCode"
                        :depend="depend"
                        :allCode="allCode"
                        @update:methodTypeParams="methodTypeParamsChange"
                    />
                </div>
                <div class="item">
                    <a-form-item
                        label="表单项手动输入功能"
                    >
                        <a-select
                            :value="disabled.toString()"
                            :disabled="disabledDisabledControl"
                            @update:value="disabledChange"
                        >
                            <a-select-option value="false">启用</a-select-option>
                            <a-select-option value="true">禁用</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="item">
                    <a-form-item
                        label="表单项是否必填"
                    >
                        <a-select
                            :value="required.toString()"
                            @update:value="requiredChange"
                        >
                            <a-select-option value="false">选填</a-select-option>
                            <a-select-option value="true">必填</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent, computed} from "vue";
import dfs from "../../../../../../dfs.js";
import VFoldToggleButton from "../../../../../../../components/VFoldToggleButton/VFoldToggleButton.vue";
import VFormItemDetailCode from "./components/VFormItemDetailCode/VFormItemDetailCode.vue";
import VFormItemMethodTypeParams from "./components/VFormItemMethodTypeParams/VFormItemMethodTypeParams.vue";

export default defineComponent({
    name: 'VFormConfigItem',
    components: {
        VFoldToggleButton,
        VFormItemDetailCode,
        VFormItemMethodTypeParams
    },
    emits: [
        'foldOrUnFoldFormItemClick',
        'removeFromItemClick',
        'update:detailName',
        'update:postscript',
        'update:detailCode',
        'update:formItemType',
        'update:methodType',
        'update:disabled',
        'update:required',
        'update:methodTypeParams'
    ],
    props: {
        formItemIndexes: {
            type: Array,
            required: true,
            default: () => ([]),
        },
        formItem: {
            type: Object,
            default: () => dfs.createFormItem(),
            required: true,
        },
        methodTypeParams: {
            type: Array,
            default: () => ([
                // detailCode
            ]),
        },
        methodTypeParamsOptions: {
            type: Array,
            default: () => ([
                // dfs.createGroup()
            ])
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
        folds: {
            type: Set,
            default: () => new Set(),
        },
        detailName: {
            type: String,
            default: '',
        },
        detailCode: {
            type: String,
            default: '',
        },
        postscript: {
            type: String,
            default: '',
        },
        formItemType: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        methodType: {
            type: String,
            default: ''
        }
    },
    setup(props, ctx) {
        const detailCodeChange = (value) => {
            ctx.emit('update:detailCode', value);
        };
        const detailNameChange = (value) => {
            ctx.emit('update:detailName', value);
        };
        const postscriptChange = (value) => {
            ctx.emit('update:postscript', value);
        };
        const formItemTypeChange = (value) => {
            ctx.emit('update:formItemType', value);
        }
        const methodTypeChange = (value) => {
            ctx.emit('update:methodType', value);
        }
        const methodTypeParamsChange = (value) => {
            ctx.emit('update:methodTypeParams', value);
        };
        // a-select 的value不支持布尔值绑定.....自己手动转换吧
        const disabledChange = (value) => {
            switch (value) {
                case 'true': {
                    value = true;
                    break;
                }
                case 'false': {
                    value = false;
                    break;
                }
                default: {
                    value = false;
                }
            }
            ctx.emit('update:disabled', value);
        };
        const requiredChange = (value) => {
            switch (value) {
                case 'true': {
                    value = true;
                    break;
                }
                case 'false': {
                    value = false;
                    break;
                }
                default: {
                    value = false;
                }
            }
            ctx.emit('update:required', value);
        };
        // 是否禁用【表单项手动输入功能】
        const disabledDisabledControl = computed(() => {
            const iMap = dfs.valueSourceDictControlInfoMap;
            if (iMap[props.methodType]) {
                return iMap[props.methodType].config_configDisabledDisabledControl;
            } else {
                return false;
            }
        });
        const showMethodTypeParamsControl = computed(() => {
            const iMap = dfs.valueSourceDictControlInfoMap;
            if (iMap[props.methodType]) {
                return iMap[props.methodType].config_showMethodTypeParamsControl;
            } else {
                return false;
            }
        })
        // 展开或折叠 某个表单项
        const foldOrUnFoldFormItemClick = () => {
            ctx.emit('foldOrUnFoldFormItemClick');
        };
        // 删除某个表单项
        const removeFromItemClick = () => {
            ctx.emit('removeFromItemClick');
        };
        
        return {
            foldOrUnFoldFormItemClick,
            removeFromItemClick,
            detailNameChange,
            postscriptChange,
            detailCodeChange,
            formItemTypeChange,
            methodTypeChange,
            methodTypeParamsChange,
            disabledDisabledControl,
            showMethodTypeParamsControl,
            disabledChange,
            requiredChange,
            dfs
        }
    }
})
</script>

<style lang="scss" scoped>
$itemWidth: 230px;
.VFormConfigItem  {
    padding: 6px;
    border-radius: 4px;
    //background-color: #cbdde9;
    background-color: #fffae8;
    &>.baseInfo  {
        display: flex;
        align-items: flex-start;
        &>.container  {
            width: 0;
            flex: 1 0 auto;
            display: flex;
            align-items: center;
            margin-left: 16px;
            &>.item  {
                width: $itemWidth;
                &:not(:first-of-type)  {
                    margin-left: 16px;
                }
            }
        }
        &>.control  {
            flex: none;
            display: flex;
            align-items: center;
            &>.ant-btn  {
                margin-right: 10px;
            }
            &>.dragButton  {
                flex: none;
                cursor: pointer;
            }
        }
    }
    &>.container  {
        display: flex;
        align-items: flex-start;
        &>.container  {
            width: 0;
            flex: 1 0 auto;
            display: flex;
            align-items: flex-start;
            margin-left: 16px;
            &>.item  {
                width: $itemWidth;
                &:not(:first-of-type)  {
                    margin-left: 16px;
                }
            }
        }
        &>.control  {
            flex: none;
            display: flex;
            align-items: center;
            &>.ant-btn  {
                margin-right: 10px;
            }
            &>.dragButton  {
                flex: none;
                cursor: pointer;
            }
        }
    }
}
</style>