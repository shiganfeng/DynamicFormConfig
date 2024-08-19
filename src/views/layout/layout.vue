<template>
    <div class="layout">
        <RouterView></RouterView>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
    components: {
        RouterView
    },
    setup() {
    
    }
})
</script>

<style lang="scss" scoped>
.layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
