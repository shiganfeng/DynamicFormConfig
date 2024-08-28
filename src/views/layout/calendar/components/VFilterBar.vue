<template>
    <div class="VFilterBar">
        <a-date-picker
            :value="month"
            :format="monthFormat"
            :value-format="monthFormat"
            picker="month"
            @update:value="monthChange"
        ></a-date-picker>
        <a-button
            type="primary"
            shape="circle"
            @click="preMonthClick"
        ><LeftOutlined /></a-button>
        <a-button
            type="primary"
            shape="circle"
            @click="nextMonthClick"
        ><RightOutlined /></a-button>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    components: {
        LeftOutlined,
        RightOutlined
    },
    props: {
        month: {
            type: String,
            default: dayjs(Date.now()).format('YYYY-MM')
        }
    },
    emits: [
        'monthChange',
        'preMonthClick',
        'nextMonthClick'
    ],
    setup(props, ctx) {
        const monthFormat = 'YYYY-MM';
        const monthChange = (val) => {
            ctx.emit('monthChange', val);
        };
        const preMonthClick = () => {
            ctx.emit('preMonthClick');
        };
        const nextMonthClick = () => {
            ctx.emit('nextMonthClick');
        };
        return {
            monthFormat,
            monthChange,
            preMonthClick,
            nextMonthClick,
            LeftOutlined,
            RightOutlined
        }
    }
})
</script>
<style scoped lang="scss">
.VFilterBar {
    width: 100%;
    margin-bottom: 32px;
    background-color: #ffffff;
    padding: 8px;
    display: flex;
    align-items: center;
    &>.ant-picker {
        margin-right: 4px;
    }
    &>.ant-btn {
        margin-right: 4px;
    }
}
</style>