<template>
    <div class="VNumber">
        <a-input-number
            :value="value"
            @update:value="valueChange"
        ></a-input-number>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
    props: {
        value: {
            type: [Number, String, null],
            default: ''
        }
    },
    emits: [
        'update:value'
    ],
    setup(props, ctx) {
        const valueChange = (value) => {
            console.log('valueChange---:', value)
            ctx.emit('update:value', value);
        };
        
        return {
            valueChange,
        }
    }
})
</script>


<style scoped lang="scss">
.VNumber {

}
</style>