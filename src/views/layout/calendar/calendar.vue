<template>
    <div class="calendar">
        <VFilterBar
            :month="month"
            @monthChange="monthChange"
            @preMonthClick="preMonthClick"
            @nextMonthClick="nextMonthClick"
        ></VFilterBar>
        <div class="weekCon">
            <div
                v-for="(item, idx) in weekArr"
                :key="idx"
                class="card"
            >
                {{item.day}}
            </div>
        </div>
        <div class="content">
            <div
                v-for="(item, idx) in calendarArr"
                :key="idx"
                class="card"
                :class="{
                    isCurrentMonth: item.isCurrentMonth
                }"
            >
                {{item.day}}
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import VFilterBar from "./components/VFilterBar.vue";
import dayjs from "dayjs";
export default defineComponent({
    components: {
        VFilterBar
    },
    setup() {
        const dateChunk = (() => {
            let month = ref(dayjs(Date.now()).format('YYYY-MM'));
            let calendarArr = ref([]);
            const weekArr = [
                {
                    day: '星期一',
                    isCurrentMonth: true
                },
                {
                    day: '星期二',
                    isCurrentMonth: true
                },
                {
                    day: '星期三',
                    isCurrentMonth: true
                },
                {
                    day: '星期四',
                    isCurrentMonth: true
                },
                {
                    day: '星期五',
                    isCurrentMonth: true
                },
                {
                    day: '星期六',
                    isCurrentMonth: true
                },
                {
                    day: '星期日',
                    isCurrentMonth: true
                }
            ];
            const monthChange = (monthValue) => {
                month.value = monthValue;
                queryDays(month.value);
            }
            const preMonthClick = () => {
                month.value = dayjs(month.value).subtract(1, 'month').format('YYYY-MM');
                queryDays(month.value);
            }
            const nextMonthClick = () => {
                month.value = dayjs(month.value).add(1, 'month').format('YYYY-MM');
                queryDays(month.value);
            }
            const queryDays = (date) => {
                const monthArr = [];
                // 当前年
                const nowYear = dayjs(date).year();
                // 上个月
                const preMonth = dayjs(date).subtract(1, 'month').month();
                // 当前月的天数
                const monthDays = dayjs(date).daysInMonth();
                // 上个月的天数
                const preMonthDays = dayjs(date).subtract(1, 'month').daysInMonth();
                console.log(preMonth, monthDays, preMonthDays);
                // 0 表示星期天
                // 月初是星期几
                const firstDayOfMonth = dayjs(date).day();
                console.log(firstDayOfMonth);
                for (let i = 1; i <= monthDays; i++) {
                    monthArr.push({
                        day: `${dayjs(date).format('M')}月${i}号`,
                        isCurrentMonth: true
                    });
                }
                // 日期往前补
                switch (firstDayOfMonth) {
                    case 0:
                        // 星期天往前补6天，不需要往后补下个月的天数
                        for (let i = 0; i <= 5; i++) {
                            monthArr.unshift({
                                day: `${preMonth + 1}月${preMonthDays - i}号`,
                                isCurrentMonth: false
                            });
                        }
                        break;
                    default:
                        // 非星期天往前补
                        for (let i = 0; i < firstDayOfMonth - 1; i++) {
                            monthArr.unshift({
                                day: `${preMonth + 1}月${preMonthDays - i}号`,
                                isCurrentMonth: false
                            });
                        }
                        break;
                }

                while (monthArr.length < 42) {
                    const endDay = monthArr[monthArr.length - 1].day;
                    const formatEndDay = dayjs(`${nowYear}-${endDay.replace('月', '-').replace('号', '')}`);
                    monthArr.push({
                        day: formatEndDay.add(1, 'day').format('M月D号'),
                        isCurrentMonth: false
                    });
                }
                console.log(monthArr);
                calendarArr.value = monthArr;
            }
            
            return {
                month,
                weekArr,
                calendarArr,
                monthChange,
                queryDays,
                preMonthClick,
                nextMonthClick
            }
        })();
        dateChunk.queryDays();
        
        return {
            calendarArr: dateChunk.calendarArr,
            month: dateChunk.month,
            weekArr: dateChunk.weekArr,
            monthChange: dateChunk.monthChange,
            preMonthClick: dateChunk.preMonthClick,
            nextMonthClick: dateChunk.nextMonthClick,
        }
    }
})
</script>
<style scoped lang="scss">
.calendar {
    width: 100%;
    height: 100%;
    padding: 16px;
    background-color: #F4F7FC;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    &>.VFilterBar {
    
    }
    &>.weekCon {
        background-color: #ffffff;
        width: 100%;
        display: flex;
        gap: 16px;
        padding: 8px;
        &>.card {
            height: 40px;
            width: 0;
            flex: 1 0 auto;
            background-color: yellowgreen;
            box-shadow: 3px 3px 11px 0 rgba(0,0,0,0.13);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &>.content {
        background-color: #ffffff;
        width: 100%;
        height: 0;
        flex: 1 0 auto;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 80px;
        gap: 16px;
        padding: 8px;
        &>.card {
            height: 100%;
            background-color: gray;
            box-shadow: 3px 3px 11px 0 rgba(0,0,0,0.13);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.isCurrentMonth {
                background-color: #33bfff;
            }
        }
    }
}
</style>