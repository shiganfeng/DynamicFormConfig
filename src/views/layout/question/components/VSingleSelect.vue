<template>
    <div class="VSingleSelect">
        <a-select
            :value="value"
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
.VSingleSelect {

}
</style>