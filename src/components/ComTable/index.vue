<template>
  <el-table
    :ref="refName"
    v-loading="loading"
    :element-loading-spinner="elementLoadingSpinner"
    :element-loading-text="elementLoadingText"
    :element-loading-background="elementLoadingBackground"
    :stripe="stripe"
    :border="border"
    :highlight-current-row="highlightCurrentRow"
    :selection="selection"
    :data="data"
    @selection-change="handleSelectionChange"
    @current-change="handleCurrentChange"
  >
    <el-table-column v-if="selection" type="selection" width="40" />
    <el-table-column v-if="index" type="index" width="70" label="序号" align="center" />
    <el-table-column
      v-for="item in columns"
      :key="item[item.key]"
      :show-overflow-tooltip="showOverflowTooltip"
      :prop="item.key"
      :label="item.title"
      :width="item.width"
      :min-width="item.minWidth"
      :fixed="item.fixed"
    >
      <template slot-scope="scope">
        <table-item
          v-if="item.render"
          :render="item.render"
          :row="scope.row"
          :index="scope.$index"
        />
        <span v-else>{{ scope.row[item.key] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import TableItem from "./components/TableItem";
export default {
  components: { TableItem },
  props: {
    // loading状态
    loading: {
      type: Boolean,
      default: false
    },
    // loading样式
    elementLoadingSpinner: {
      type: String,
      default: ""
    },
    // loading文字提示
    elementLoadingText: {
      type: String,
      default: ""
    },
    // loading背景颜色
    elementLoadingBackground: {
      type: String,
      default: ""
    },
    // 组件名称
    refName: {
      type: String,
      default: "table"
    },
    // 是否斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否边框
    border: {
      type: Boolean,
      default: true
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 是否开启多选
    selection: {
      type: Boolean,
      default: false
    },
    // 是否显示序号
    index: {
      type: Boolean,
      default: true
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 表格头部
    columns: {
      type: Array,
      default: () => []
    },
    // 是否允许使用tooltip
    showOverflowTooltip: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      const checkList = [];
      this.$attrs["default-selected-list"] &&
        this.$attrs["default-selected-list"].forEach(row => {
          this.data.forEach(item => {
            if (item.unid == row.unid) {
              checkList.push(item);
            }
          });
        });
      // console.log(checkList)
      checkList.forEach(row => {
        !this.selection &&
          this.highlightCurrentRow &&
          this.$refs.table.setCurrentRow(row);
        this.selection && this.$refs.table.toggleRowSelection(row);
      });
    });
  },
  methods: {
    // 多选
    handleSelectionChange(val) {
      this.$emit("select-cell", val);
    },
    // 单选
    handleCurrentChange(val) {
      this.$emit("change-cell", val);
    }
  }
};
</script>

<style>
</style>
