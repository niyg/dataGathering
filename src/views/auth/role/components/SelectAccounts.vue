<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4" class="com-col-dialog-wrap">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="unid"
          :default-expanded-keys="['10000']"
          :expand-on-click-node="false"
          highlight-current
          accordion
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="10">
        <div class="com-searh-wrap">
          <search
            :data="searchData"
            :show-reset="false"
            @search-submit="searchSubmit"
          />
        </div>
        <div class="com-table-wrap">
          <com-table
            :columns="columns.concat([{
              title: '操作',
              key: 'action',
              render: (h, params, index) => {
                return h('el-button', {
                  props: { type: 'primary', size: 'mini' },
                  on: { click: () => { addRight(params) } }
                }, '添加')
              }
            }])"
            :data="listData"
          />
        </div>
        <el-pagination
          :current-page.sync="defalutParams.pageNum"
          :page-size="defalutParams.pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          class="com-table-pagination"
          @current-change="handleCurrentChange"
        />
      </el-col>
      <el-col :span="10">
        <div class="com-searh-wrap">
          <search
            :data="searchData"
            :show-reset="false"
            @search-submit="searchRightSubmit"
          />
        </div>
        <div class="com-table-wrap">
          <com-table
            :columns="columns.concat([{
              title: '操作',
              key: 'action',
              render: (h, params, index) => {
                return h('el-button', {
                  props: { type: 'danger', size: 'mini' },
                  on: { click: () => { delRight(params, index) } }
                }, '移除')
              }
            }])"
            :data="filterRight"
          />
        </div>
        <el-pagination
          :current-page.sync="rightParams.pageNum"
          :page-size="rightParams.pageSize"
          :total="totalRight"
          layout="prev, pager, next, jumper"
          class="com-table-pagination"
          @current-change="handleCurrentChangeRight"
        />
      </el-col>
    </el-row>
    <footer class="com-footer-wrap">
      <el-button
        v-ripples
        type="primary"
        @click="saveData"
      >
        确 定
      </el-button>
      <el-button v-ripples @click="closeDialog">
        取 消
      </el-button>
    </footer>
  </div>
</template>

<script>
import Search from '_c/Search'
import ComTable from '_c/ComTable'
import { deepClone } from '@/utils'
export default {
  components: {
    Search,
    ComTable
  },
  props: {
    rightData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchParams: null,
      treeData: [], // 树形
      listData: [], // 左边列表数据
      total: 0, // 左边总条数
      listDataRight: [], // 右边列表数据
      totalRight: 0, // 右边边总条数
      defalutParams: {
        pageNum: 1,
        pageSize: 10
      },
      rightParams: {
        pageNum: 1,
        pageSize: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchData: [
        {
          label: '姓名',
          value: '',
          type: 'input',
          placeholder: '请输入姓名',
          field: 'name',
          clearable: true
        }
      ],
      columns: [
        {
          title: '账号',
          key: 'account'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '部门',
          key: 'departmentName'
        },
        {
          title: '状态',
          key: 'state',
          render: (h, params, index) => {
            return h('el-tag', {
              props: { type: params.state === 1 ? 'success' : 'danger' }
            }, params.state === 1 ? '启用' : '禁用')
          }
        }
      ]
    }
  },
  computed: {
    filterRight() {
      let data = null
      if (this.searchParams && this.searchParams.name) {
        const filterData = this.listDataRight.filter((item, index) => {
          return item.name.includes(this.searchParams.name)
        })
        data = filterData.slice((this.rightParams.pageNum - 1) * this.rightParams.pageSize, this.rightParams.pageNum * this.rightParams.pageSize)
      } else {
        data = this.listDataRight.slice((this.rightParams.pageNum - 1) * this.rightParams.pageSize, this.rightParams.pageNum * this.rightParams.pageSize)
      }
      return data
    }
  },
  created() {
    this.listDataRight = this.rightData
    this.getList()
    this.getTree()
  },
  methods: {
    // 获取树形
    async getTree() {
      const res = await this.$api.accounts.treeList()
      if (res) {
        this.treeData = res
      }
    },
    // 树形选中
    handleNodeClick(data, node) {
      this.defalutParams = Object.assign(this.defalutParams, { departmentId: data.unid })
      this.getList()
    },
    // 获取列表数据
    async getList() {
      const res = await this.$api.accounts.accountsList(this.defalutParams)
      if (res) {
        this.listData = res.content
        this.total = res.totalElements
      }
    },
    // 查询
    searchSubmit(row) {
      this.defalutParams = Object.assign(this.defalutParams, row)
      this.defalutParams.pageNum = 1
      this.getList()
    },
    // 分页
    handleCurrentChange(val) {
      this.defalutParams.pageNum = val
      this.getList()
    },
    handleCurrentChangeRight(val) {
      this.rightParams.pageNum = val
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog', false)
    },
    // 右边查询
    searchRightSubmit(row) {
      this.searchParams = deepClone(row)
    },
    // 添加
    addRight(row) {
      const result = this.listDataRight.some(item => {
        if (item.unid === row.unid) {
          return true
        }
      })
      if (!result) {
        this.listDataRight.push(row)
      } else {
        this.$message.warning('请勿重复添加')
      }
      this.totalRight = this.listDataRight.length
    },
    // 删除右边
    delRight(row, index) {
      this.listDataRight.splice(index, 1)
      this.totalRight = this.listDataRight.length
    },
    // 确定
    saveData() {
      this.$emit('selectAccounts', this.listDataRight)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-tree-node__content {
  height: 50px;
}
.com-col-dialog-wrap {
  height: 82.2vh;
  overflow: auto;
}
</style>
