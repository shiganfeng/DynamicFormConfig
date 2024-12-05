<template>
    <div class="VComputeText">
        <a-input-number
            :value="value"
            :disabled="true"
        ></a-input-number>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        value: {
            type: [Number, String, null],
            default: ''
        }
    }
})
</script>


<style scoped lang="scss">
.VComputeText {

}
</style>