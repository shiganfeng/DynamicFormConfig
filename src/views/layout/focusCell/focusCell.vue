<template>
    <div @keydown="handleKeydown" tabindex="0" class="page-container">
        <!-- 每个单元格 -->
        <div
            v-for="(cell, index) in cells"
            :key="index"
            :ref="`cell-${index}`"
            class="cell"
            tabindex="0"
            @focus="cellClick(index)"
            :class="{'focused': currentCellIndex === index}"
        >
            <!-- 单元格内的组件 -->
            <a-input v-model:value="cell.inputValue" ref="input" placeholder="Input Field" />
            <a-select
                v-model:value="cell.selectedValue"
                ref="select"
                placeholder="Select"
                style="width: 150px;margin-top: 16px;"
                @click="selectClick"
            >
                <a-select-option value="jack">Jack</a-select-option>
            </a-select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentCellIndex: 0, // 当前聚焦单元格的索引
            currentComponentIndex: 0, // 当前聚焦的单元格内组件的索引
            cells: [
                { inputValue: '', selectedValue: '', buttonClicked: false },
                { inputValue: '', selectedValue: '', buttonClicked: false },
                { inputValue: '', selectedValue: '', buttonClicked: false },
            ],
        };
    },
    mounted() {
        // 默认聚焦第一个单元格的第一个组件
        this.focusComponent(0, 0);
    },
    methods: {
        cellClick(index) {
            this.currentCellIndex = index;
            this.currentComponentIndex = 0;
            this.focusComponent(this.currentCellIndex, this.currentComponentIndex);
        },
        handleKeydown(event) {
            const key = event.key;
            console.log('key----:', key);
            if (key === 'ArrowDown') {
                this.moveFocus('down');
            } else if (key === 'ArrowUp') {
                this.moveFocus('up');
            } else if (key === 'ArrowRight') {
                this.moveFocus('right');
            } else if (key === 'ArrowLeft') {
                this.moveFocus('left');
            }
        },
        
        // 移动焦点
        moveFocus(direction) {
            // 所有单元格的数量
            const totalCells = this.cells.length;
            console.log('totalCells----', totalCells);
            // 当前聚焦的单元格内的组件的数量
            const componentsInCurrentCellNum = this.$refs[`cell-${this.currentCellIndex}`][0].children.length;
            console.log('componentsInCurrentCellNum', componentsInCurrentCellNum);
            if (direction === 'down' || direction === 'right') {
                if (this.currentComponentIndex < componentsInCurrentCellNum - 1) {
                    this.currentComponentIndex++;
                } else if (this.currentCellIndex < totalCells - 1) {
                    // 切换到下一个单元格
                    this.currentCellIndex++;
                    // 聚焦到下一个单元格的第一个组件
                    this.currentComponentIndex = 0;
                }
            } else if (direction === 'up' || direction === 'left') {
                if (this.currentComponentIndex > 0) {
                    this.currentComponentIndex--;
                } else if (this.currentCellIndex > 0) {
                    // 切换到上一个单元格
                    this.currentCellIndex--;
                    // 聚焦到上一个单元格的最后一个组件
                    this.currentComponentIndex = this.$refs[`cell-${this.currentCellIndex}`].length - 1;
                }
            }
            
            this.focusComponent(this.currentCellIndex, this.currentComponentIndex);
        },
        
        focusComponent(cellIndex, componentIndex) {
            const cellRef = `cell-${cellIndex}`;
            console.log('cellRef', this.$refs[cellRef][0]);
            const component = this.$refs[cellRef][0]?.children[componentIndex];
            console.log('component', component, component.classList, this.$refs[cellRef][0]);
            const childCom = this.$refs[cellRef];
            console.log('childCom', childCom);
            if (component) {
                component.focus();
                // 如果是下拉框，自动弹开
                if (component.classList.contains('ant-select')) {
                    // 获取下拉框的触发按钮
                    const selectTrigger = component.querySelector('.ant-select-selector');
                    console.log('selectTrigger', selectTrigger);
                    if (selectTrigger) {
                        // 模拟点击事件，展开下拉框
                        selectTrigger.click();
                    }
                }
            }
            // console.log(this.$refs['select'])
            // this.$refs['select'].forEach((item, index) => {
            //     console.log(item)
            //     if (index === 2) {
            //         item.focus()
            //     }
            // })
        },
        getCurrentCellRef(cellIndex) {
            return `cell-${cellIndex}`;
        },
        selectClick(e) {
            console.log(e)
        }
    },
};
</script>

<style lang="scss" scoped>
.page-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}

.cell {
    width: 200px;
    margin: 10px;
    padding: 10px;
    border: 10px solid #ccc;
    cursor: pointer;
}

.cell.focused {
    border-color: #409eff; /* 给焦点单元格加上边框颜色 */
}

.cell:focus {
    outline: none;
}
</style>
