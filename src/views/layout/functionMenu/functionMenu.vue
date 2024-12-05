<template>
    <div class="functionMenu">
        <div class="menuCon">
            <div
                v-for="item in selectMenus"
                :key="item.name"
                class="menuItem"
                @click="menuClick(item)"
            >
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    setup() {
        const router = useRouter();
        const menuChunk = (() => {
            const selectMenus = ref([
                {
                    label: '日历',
                    name: 'calendar'
                },
                {
                    label: '动态表单配置',
                    name: 'formConfig'
                },
                {
                    label: '简单表单配置',
                    name: 'question'
                },
                {
                    label: '单元格组件聚焦',
                    name: 'focusCell'
                }
            ]);
            const menuClick = (menu) => {
                router.push({
                    name: menu.name
                })
            };
            
            return {
                selectMenus,
                menuClick
            }
        })()
        
        return {
            selectMenus: menuChunk.selectMenus,
            menuClick: menuChunk.menuClick
        }
    }
})
</script>

<style scoped lang="scss">
.functionMenu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &>.menuCon {
        width: 100%;
        display: flex;
        gap: 32px;
        padding: 32px;
        &>.menuItem {
            height: 40px;
            padding: 0 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            font-size: 16px;
            background-color: #1677ff;
            cursor: pointer;
            border-radius: 8px;
        }
    }
}

</style>