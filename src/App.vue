<template>
    <div class="app">
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
.app {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
}
</style>
