<template>
    <div class="app">
        <a-config-provider :locale="locale">
            <RouterView></RouterView>
        </a-config-provider>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
    components: {
        RouterView
    },
    setup() {
        return {
            locale: zhCN
        }
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
