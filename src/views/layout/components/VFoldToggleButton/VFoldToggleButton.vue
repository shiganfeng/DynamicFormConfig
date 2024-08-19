<template>
    <a-button
        :type="checkedValue ? trueType : falseType"
        class="VFoldToggleButton"
        @click="click"
    >
        {{ checkedValue ? trueText : falseText }}
    </a-button>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
    emits: ['click'],
    props: {
        trueType: {
            type: String,
            default: 'primary',
        },
        falseType: {
            type: String,
            default: 'default',
        },
        trueText: {
            type: String,
            default: '展开'
        },
        falseText: {
            type: String,
            default: '折叠'
        },
        checkedValue: {
            type: Boolean,
            default: false
        }
    },
    setup(props, ctx) {
        const click = () => {
            ctx.emit('click')
        };
        
        return {
            click
        }
    }
})

</script>

<style scoped lang="scss">
.VFoldToggleButton {
}
</style>