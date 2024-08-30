<template>
    <div class="VMultipleSelect">
        <a-select
            :value="value"
            mode="multiple"
            placeholder="Please select"
            @update:value="valueChange"
        >
            <a-select-option
                v-for="item in options"
                :key="item.code"
                :value="item.code"
            >{{item.label}}</a-select-option>
        </a-select>
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
.VMultipleSelect {

}
</style>