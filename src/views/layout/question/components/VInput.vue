<template>
    <div class="VInput">
        <a-input
            :value="value"
            @update:value="valueChange"
        ></a-input>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        value: {
            type: String,
            default: ''
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
.VInput {

}
</style>