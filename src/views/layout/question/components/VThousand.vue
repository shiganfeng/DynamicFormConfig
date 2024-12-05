<template>
    <div class="VThousand">
        <a-input
            :value="showValue"
            :disabled="true"
        ></a-input>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { formatValue } from '../../questionConfig/mockData.js';
export default defineComponent({
    props: {
        value: {
            type: [String, Number],
            default: ''
        }
    },
    setup(props, ctx) {
        const showValue = computed(() => {
            return formatValue(props.value, 'VThousand');
        });
        
        return {
            showValue
        }
    }
})
</script>


<style scoped lang="scss">
.VThousand {
    
}
</style>