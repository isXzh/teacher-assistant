<template>
  <div class="app-table">
    <el-table
      ref="tableRef"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :row-key="rowKey"
      :empty-text="emptyText"
      :default-sort="{ prop: defaultSortProp, order: defaultSortOrder }"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @click="handleClick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleCurrentChange"
      @header-dragend="handleHeaderDragend"
      @expand-change="handleExpandChange"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        :width="selectionWidth"
        :fixed="selectionFixed"
        :selectable="selectable"
      ></el-table-column>
      
      <el-table-column
        v-if="index"
        type="index"
        :label="indexLabel"
        :width="indexWidth"
        :fixed="indexFixed"
        :index="indexMethod"
      ></el-table-column>
      
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :render-header="column.renderHeader"
        :sortable="column.sortable"
        :sort-method="column.sortMethod"
        :sort-by="column.sortBy"
        :sort-orders="column.sortOrders"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align || 'left'"
        :header-align="column.headerAlign || 'left'"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
        :selectable="column.selectable"
        :reserve-selection="column.reserveSelection"
        :filters="column.filters"
        :filter-placement="column.filterPlacement"
        :filter-multiple="column.filterMultiple"
        :filter-method="column.filterMethod"
        :filtered-value="column.filteredValue"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="column.slot" :row="scope.row" :$index="scope.$index" :column="column"></slot>
        </template>
      </el-table-column>
      
      <slot name="columns"></slot>
      
      <el-table-column
        v-if="actions"
        :label="actionsLabel"
        :width="actionsWidth"
        :fixed="actionsFixed"
        :align="actionsAlign || 'right'"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="showPagination && pagination.total > 0" class="pagination-wrapper">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :layout="pagination.layout"
        :total="pagination.total"
        :background="pagination!background"
        :small="pagination.small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      ></el-pagination>
    </div>
    
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading" name="size"></el-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number],
      default: null
    },
    maxHeight: {
      type: [String, Number],
      default: null
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['medium', 'small', 'mini', 'large'].includes(value)
    },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    currentRowKey: {
      type: String,
      default: ''
    },
    rowClassName: {
      type: [String, Function],
      default: ''
    },
    rowStyle: {
      type: [Object, Function],
      default: () => ({})
    },
    cellClassName: {
      type: [String, Function],
      default: ''
    },
    cellStyle: {
      type: [Object, Function],
      default: () => ({})
    },
    headerRowClassName: {
      type: [String, Function],
      default: ''
    },
    headerRowStyle: {
      type: [Object, Function],
      default: () => ({})
    },
    headerCellClassName: {
      type: [String, Function],
      default: ''
    },
    headerCellStyle: {
      type: [Object, Function],
      default: () => ({})
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    defaultSortProp: {
      type: String,
      default: ''
    },
    defaultSortOrder: {
      type: String,
      default: ''
    },
    tooltipEffect: {
      type: String,
      default: 'dark',
      validator: value => ['dark', 'light'].includes(value)
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: '合计'
    },
    summaryMethod: {
      type: Function,
      default: null
    },
    spanMethod: {
      type: Function,
      default: null
    },
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: null
    },
    treeProps: {
      type: Object,
      default: () => ({})
    },
    selection: {
      type: Boolean,
      default: false
    },
    selectionWidth: {
      type: [String, Number],
      default: 55
    },
    selectionFixed: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Function,
      default: null
    },
    index: {
      type: Boolean,
      default: false
    },
    indexLabel: {
      type: String,
      default: '#'
    },
    indexWidth: {
      type: [String, Number],
      default: 50
    },
    indexFixed: {
      type: Boolean,
      default: false
    },
    indexMethod: {
      type: Function,
      default: null
    },
    actions: {
      type: Boolean,
      default: false
    },
    actionsLabel: {
      type: String,
      default: '操作'
    },
    actionsWidth: {
      type: [String, Number],
      default: 200
    },
    actionsFixed: {
      type: Boolean,
      default: false
    },
    actionsAlign: {
      type: String,
      default: 'right'
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => ({
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: false,
        small: false
      })
    }
  },
  data() {
    return {
      tableRef: null
    }
  },
  computed: {
    tableData() {
      return this.data
    }
  },
  methods: {
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    handleSelectAll(selection) {
      this.$emit('select-all', selection)
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleCellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    handleCellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    handleCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    handleCellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    handleRowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    handleRowDblclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    handleClick(row, column, cell, event) {
      this.$emit('click', row, column, { cell, event })
    },
    handleHeaderClick(column, event) {
      this.$emit('header-click', column, event)
    },
    handleHeaderContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    handleSortChange(column, prop, order) {
      this.$emit('sort-change', { column, prop, order })
    },
    handleFilterChange(filters) {
      this.$emit('filter-change', filters)
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    handleHeaderDragend(newWidthEvent, oldWidth, column, event) {
      this.$emit('header-dragend', { newWidthEvent, oldWidth, column, event })
    },
    handleExpandChange(row, expandedRows) {
      this.$emit('expand-change', row, expandedRows)
    },
    handleSizeChange(pageSize) {
      this.$emit('page-change', { currentPage: 1, pageSize })
    },
    handleCurrentPageChange(currentPage) {
      this.$emit('page-change', { currentPage, pageSize: this.pagination.pageSize })
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection()
()
    },
    toggleRowSelection(row, selected) {
      this.$refs.tableRef.toggleRowSelection(row, selected)
    },
    toggleAllSelection() {
      this.$refs.tableRef.toggleAllSelection()
    },
    setCurrentRow(row) {
      this.$refs.tableRef.setCurrentRow(row)
    },
    clearSort() {
      this.$refs.tableRef.clearSort()
    },
    clearFilter(columnKeys) {
      this.$refs.tableRef.clearFilter(columnKeys)
    },
    doLayout() {
      this.$refs.tableRef.doLayout()
    },
    sort(prop, order) {
      this.$refs.tableRef.sort(prop, order)
    }
  }
}
</script>

<style scoped>
.app-table {
  position: relative;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.loading-overlay .el-icon {
  font-size: 32px;
  color: #409eff;
}
</style>
