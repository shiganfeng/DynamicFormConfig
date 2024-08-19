<template>
    <div class="VText" :title="text">
        {{ text }}
    </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    setup() {
    
    }
})

</script>

<style scoped lang="scss">
.VText {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>