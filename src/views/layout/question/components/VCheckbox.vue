<template>
    <div class="VCheckbox">
        <a-checkbox-group :value="value" @update:value="valueChange">
            <a-checkbox
                v-for="item in options"
                :key="item.code"
                :value="item.code"
            >{{item.label}}</a-checkbox>
        </a-checkbox-group>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        value: {
            type: Array,
            default: () => ([])
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
.VCheckbox {

}
</style>