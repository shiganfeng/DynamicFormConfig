<template>
    <div class="VDateTime">
        <a-date-picker
            :value="value"
            show-time
            placeholder="Select Time"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            @update:value="valueChange"
        ></a-date-picker>
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
            console.log(value);
            ctx.emit('update:value', value);
        };
        
        return {
            valueChange
        }
    }
})
</script>


<style scoped lang="scss">
.VDateTime {

}
</style>