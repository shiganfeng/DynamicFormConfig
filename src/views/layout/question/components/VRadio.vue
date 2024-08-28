<template>
    <div class="VRadio">
        <a-radio-group :value="value" @update:value="valueChange">
            <a-radio
                v-for="item in options"
                :key="item.code"
                :value="item.code"
            >{{item.label}}</a-radio>
        </a-radio-group>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        value: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => ([
                // {
                //     label: 'JavaScript',
                //     code: 'JavaScript'
                // },
            ])
        }
    },
    emits: [
        'update:value'
    ],
    setup(props, ctx) {
        const valueChange = (value) => {
            ctx.emit('update:value', value);
        };
        
        return {
            valueChange
        }
    }
})
</script>


<style scoped lang="scss">
.VRadio {

}
</style>