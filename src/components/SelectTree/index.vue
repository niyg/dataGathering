<template>
  <el-select
    ref="select"
    class="tree-select"
    v-bind="$attrs"
    :value="valueTitle"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :multiple="showCheckbox"
    collapse-tags
    @clear="clear"
    @remove-tag="removeTag"
  >
    <el-input
      v-if="showSearch"
      v-model="filterText"
      class="select-input"
      clearable
      placeholder="请输入关键字查询"
    />
    <el-option v-bind="$attrs">
      <el-tree
        ref="selectTree"
        :highlight-current="!showCheckbox"
        accordion
        check-strictly
        :node-key="defaultProps.value"
        :data="options"
        :expand-on-click-node="showCheckbox"
        :default-expanded-keys="defaultExpandedKeys"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :show-checkbox="showCheckbox"
        @node-click="handleNodeClick"
        @check-change="checkChange"
      />
    </el-option>
  </el-select>
</template>

<script>
import { findIndex, deepClone } from '@/utils'
export default {
  name: 'SelectTrees',
  props: {
    // 下拉数据
    options: {
      type: Array,
      default: () => []
    },
    // 配置项
    defaultProps: {
      type: Object,
      default: () => {
        return {
          value: 'value', // ID字段名
          label: 'label', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 是否显示查询
    showSearch: {
      type: Boolean,
      default: false
    },
    // 是否显示多选
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterText: '',
      valueTitle: '',
      defaultExpandedKeys: [],
      selectArr: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.selectTree.filter(val)
    }
  },
  created() {
    this.$nextTick(() => {
      this.initHandle()
    })
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.$attrs.value && typeof this.$attrs.value !== 'object') {
        this.valueTitle = this.$refs.selectTree.getNode(this.$attrs.value).data[this.defaultProps.label] // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.$attrs.value) // 设置默认选中
        this.defaultExpandedKeys = [this.$attrs.value]
      } else {
        if (this.$attrs.value.length > 0) {
          this.$refs.selectTree.setCheckedKeys(this.$attrs.value)
        }
      }
    },
    // 清空选中
    clear() {
      if (!this.showCheckbox) {
        this.$emit('input', '')
        this.valueTitle = ''
        this.defaultExpandedKeys = []
        this.$refs.selectTree.setCurrentKey()
      } else {
        this.$emit('input', [])
        this.valueTitle = ''
        this.$refs.selectTree.setCheckedNodes([])
      }
    },
    // 树形选中
    handleNodeClick(data, node, vNode) {
      if (!this.showCheckbox) {
        this.$emit('input', data[this.defaultProps.value])
        this.$emit('on-select-change', node)
        this.valueTitle = data[this.defaultProps.label]
        this.$refs.select.blur()
      }
    },
    // 筛选
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 多选
    checkChange(data) {
      this.selectArr = this.$refs.selectTree.getCheckedNodes(false, false)
      this.$emit('input', this.selectArr.map(v => {
        return v[this.defaultProps.value]
      }))
      this.valueTitle = this.selectArr.map(v => {
        return v[this.defaultProps.label]
      })
    },
    // 清除tag
    removeTag(val) {
      const index = findIndex(this.selectArr, item => item[this.defaultProps.label] === val)
      if (index !== -1) {
        this.selectArr.splice(index, 1)
        this.valueTitle.splice(index, 1)
        this.$emit('input', this.selectArr.map(v => {
          return v[this.defaultProps.value]
        }))
        const newArr = deepClone(this.selectArr)
        this.$refs.selectTree.setCheckedNodes(newArr)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li /deep/ .el-tree .el-tree-node__content {
  height: auto;
}
.select-input {
  box-sizing: border-box;
  width: calc(~"100% - 10px");
  margin-bottom: 5px;
  position: relative;
  left: 5px;
}
/deep/.el-tree-node__label {
  padding-left: 5px;
}
</style>
