<template>
    <div @keydown="handleKeydown" tabindex="0" class="page-container">
        <!-- 每个单元格 -->
        <div
            v-for="(cell, index) in cells"
            :key="index"
            :ref="`cell-${index}`"
            class="cell"
            tabindex="0"
            @focus="currentCellIndex = index"
            :class="{'focused': currentCellIndex === index}">
            <!-- 单元格内的组件 -->
            <a-input ref="input" placeholder="Input Field" />
            <a-select ref="select" placeholder="Select" style="margin-top: 20px;">
                <a-select-option value="jack">Jack</a-select-option>
            </a-select>
            <a-button ref="button" style="margin-top: 20px;">Button</a-button>
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
        this.focusComponent(0, 0); // 默认聚焦第一个单元格的第一个组件
    },
    methods: {
        handleKeydown(event) {
            const key = event.key;
            
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
            // 当前聚焦的单元格内的组件的数量
            const componentsInCurrentCell = this.$refs[this.getCurrentCellRef(this.currentCellIndex)].length;
            
            if (direction === 'down' || direction === 'right') {
                if (this.currentComponentIndex < componentsInCurrentCell - 1) {
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
                    this.currentComponentIndex = this.$refs[this.getCurrentCellRef(this.currentCellIndex)].length - 1;
                }
            }
            
            this.focusComponent(this.currentCellIndex, this.currentComponentIndex);
        },
        
        focusComponent(cellIndex, componentIndex) {
            const cellRef = this.getCurrentCellRef(cellIndex);
            const component = this.$refs[cellRef]?.[componentIndex];
            if (component) {
                component.focus();
            }
        },
        
        getCurrentCellRef(cellIndex) {
            return `cell-${cellIndex}`;
        },
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
    border: 1px solid #ccc;
}

.cell.focused {
    border-color: #409eff; /* 给焦点单元格加上边框颜色 */
}

.cell:focus {
    outline: none;
}
</style>
