<template>
    <div class="VSwitch">
        <a-switch
            :checked="value"
            @change="valueChange"
        ></a-switch>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        value: {
            type: Boolean,
            default: false
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
.VSwitch {

}
</style>