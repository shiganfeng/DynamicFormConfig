<template>
    <div class="VFormConfigGroup">
        <div class="baseInfo">
            <div class="container">
                <div class="item">
                    <a-form-item
                        label="分组名"
                        :name="[...formItemIndexes, 'groupName']"
                        :rules="[{ required: true }]"
                    >
                        <a-input
                            v-model:value="group.groupName"
                            placeholder="请输入"
                        />
                    </a-form-item>
                </div>
                <div class="item">
                    <a-form-item
                        label="分组业务标识"
                        :name="[...formItemIndexes, 'groupCode']"
                        :rules="groupCodeRule"
                    >
                        <a-input
                            v-model:value="group.groupCode"
                            placeholder="请输入"
                        />
                    </a-form-item>
                </div>
                <div class="item">
                    <a-form-item
                        label="备注"
                        :name="[...formItemIndexes, 'groupStruct', 'postscript']"
                    >
                        <a-input
                            v-model:value="group.groupStruct.postscript"
                            placeholder="请输入"
                        />
                    </a-form-item>
                </div>
            </div>
            <div class="control">
                <VFoldToggleButton
                    :checkedValue="isFoldAllGroupFormItemKey"
                    trueText="展开组内所有表单项"
                    falseText="折叠组内所有表单项"
                    @click="foldOrUnGroupAllFormItemClick(group.uniqueKey)"
                />
                <VFoldToggleButton
                    :checkedValue="folds.has(group.uniqueKey)"
                    trueText="展开"
                    falseText="折叠"
                    @click="foldOrUnGroupClick(group.uniqueKey)"
                />
                <a-button danger @click="subGroup">删除</a-button>
                <div class="groupDragButton">
                    <a-button
                        type="primary"
                    >拖动</a-button>
                    <!--<SvgIcon name="drag" />-->
                </div>
            </div>
        </div>
        <div v-show="!folds.has(group.uniqueKey)" class="container">
            <vueDraggable
                v-model="group.groupStruct.formItems"
                tag="div"
                class="components"
                handle=".formItemDragButton"
                itemKey="uniqueKey"
                :animation="200"
                :scrollSensitivity="150"
                :scrollSpeed="50"
            >
                <template #item="{element: formItem, index: formItemIndex}">
                    <VFormConfigItem
                        :key="formItem.uniqueKey"
                        :formItemIndexes="[...formItemIndexes, 'groupStruct', 'formItems', formItemIndex]"
                        :formItem="formItem"
                        :methodTypeParamsOptions="methodTypeParamsOptions"
                        :depend="depend"
                        :allCode="allCode"
                        :folds="folds"
                        v-model:detailName="formItem.detailName"
                        v-model:detailCode="formItem.detailCode"
                        v-model:postscript="formItem.formItemStruct.postscript"
                        v-model:formItemType="formItem.formItemStruct.config.formItemType"
                        v-model:disabled="formItem.formItemStruct.config.disabled"
                        v-model:required="formItem.formItemStruct.config.required"
                        v-model:methodType="formItem.formItemStruct.config.sourceMethod.methodType"
                        v-model:methodTypeParams="formItem.formItemStruct.config.sourceMethod.methodTypeParams"
                        @update:methodType="v => methodTypeChange(formItem, v)"
                        @foldOrUnFoldFormItemClick="foldOrUnFoldFormItemClick(formItem.uniqueKey)"
                        @removeFromItemClick="removeFromItemClick(formItemIndex)"
                    ></VFormConfigItem>
                </template>
            </vueDraggable>
            <div class="buttonControl">
                <a-button type="primary" @click="addFormItem">添加表单项</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent, nextTick} from "vue";
import dfs from "../../../../dfs.js";
import VFoldToggleButton from "../../../../../components/VFoldToggleButton/VFoldToggleButton.vue";
import vueDraggable from "vuedraggable";
import VFormConfigItem from "./components/VFormConfigItem/VFormConfigItem.vue";

export default defineComponent({
    name: 'VFormConfigGroup',
    components: {
        VFoldToggleButton,
        vueDraggable,
        VFormConfigItem
    },
    emits: [
        'foldOrUnGroupAllFormItemClick',
        'foldOrUnGroupClick',
        'subGroup',
        'foldOrUnFoldFormItemClick',
        'removeFromItemClick',
        'addFormItem',
        'methodTypeChange'
    ],
    props: {
        formItemIndexes: { // 触发表单验证的validate方法，属性必填
            type: Array,
            required: true,
            default: () => ([]),
        },
        groupIndex: {
            type: Number,
            required: true
        },
        group: {
            type: Object,
            default: () => (dfs.createGroup())
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
        allKey: {
            type: Object,
            default: () => ({
                allGroupUniqueKeySet: new Set(),
                allFormItemUniqueKeyFlatSet: new Set(),
                allGroupFormItemUniqueKeyMap: new Map(),
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
        isFoldAllGroupFormItemKey: {
            type: Boolean,
            default: false
        }
    },
    setup(props, ctx) {
        const groupCodeRule = [
            {
                validator:  async (_rule, value) => {
                    await nextTick();
                    if(value !== 0) {
                        value = (value || '').trim();
                    }
                    if (value === '') {
                        return Promise.reject('分组业务标识必填');
                    } else {
                        const arr = props.allCode.allGroupCodeArray;
                        const length = arr.length;
                        let n = 0;
                        for (let i = 0; i < length; i++) {
                            const forCurrentValue = arr[i];
                            if (forCurrentValue === value) {
                                n++;
                                if (n >= 2) {
                                    return Promise.reject('分组业务标识不可以重复');
                                }
                            }
                        }
                    }
                },
                required: true,
                trigger: 'change',
            }
        ];
        // 展开或折叠 某个组
        const foldOrUnGroupClick = (groupUniqueKey) => {
            ctx.emit('foldOrUnGroupClick', groupUniqueKey);
        };
        // 展开或折叠 某个组内的所有表单项
        const foldOrUnGroupAllFormItemClick = (groupUniqueKey) => {
            ctx.emit('foldOrUnGroupAllFormItemClick', groupUniqueKey);
        };
        // 删除某个组
        const subGroup = () => {
            ctx.emit('subGroup');
        };
        // 添加组内表单项
        const addFormItem = () => {
            ctx.emit('addFormItem');
        };
        // 删除某个表单项
        const removeFromItemClick = (formItemIndex) => {
            ctx.emit('removeFromItemClick', formItemIndex);
        }
        // 展开或折叠 某个表单项
        const foldOrUnFoldFormItemClick = (formItemUniqueKey) => {
            ctx.emit('foldOrUnFoldFormItemClick', formItemUniqueKey);
        };
        const methodTypeChange = (formItem, methodType) => {
            ctx.emit('methodTypeChange', formItem, methodType);
        };
        return {
            groupCodeRule,
            foldOrUnGroupAllFormItemClick,
            foldOrUnGroupClick,
            subGroup,
            foldOrUnFoldFormItemClick,
            removeFromItemClick,
            addFormItem,
            methodTypeChange
        }
    }
})

</script>

<style scoped lang="scss">
$itemWidth: 230px;
.VFormConfigGroup  {
    background-color: #e6f4ff;
    border-radius: 4px;
    padding: 16px;
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
        padding-left: 30px;
        &>.components  {
            &>.VFormConfigItem  {
                &:not(:first-of-type)  {
                    margin-top: 16px;
                }
            }
        }
        &>.buttonControl  {
            display: flex;
            align-items: center;
            margin-top: 16px;
            padding-left: 16px;
        }
    }
}
</style>