<template>
  <div class="com-content-wrap">
    <el-row :gutter="10">
      <el-col :span="5">
        <div>
          <div class="com-searh-wrap">
            <div class="com-title-item com-title-item-right">
              <el-tooltip
                effect="dark"
                content="新增"
                placement="top"
              >
                <i class="el-icon-circle-plus-outline" @click="showAddInput" />
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i class="el-icon-edit" @click="editTree" />
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="删除"
                placement="top"
              >
                <i class="el-icon-delete" @click="delTree" />
              </el-tooltip>
            </div>
            <div class="com-tree-wrap">
              <el-input
                v-if="showAdd"
                ref="addInput"
                v-model="addValue"
                placeholder="请输入部门名称"
                @blur="inputBlur"
                @keyup.enter.native="addTree"
              />
              <el-tree
                :data="treeData"
                :props="defaultProps"
                node-key="unid"
                :default-expanded-keys="['10000']"
                :expand-on-click-node="false"
                highlight-current
                accordion
                @node-click="handleNodeClick"
              >
                <div slot-scope="{ node, data}" class="custom-tree-node">
                  <el-input
                    v-if="showEdit && data.unid === seletTreeData.unid"
                    :ref="'input' + data.unid"
                    v-model="inputValue"
                    size="mini"
                    maxlength="10"
                    @blur="inputBlur(data)"
                    @keyup.enter.native="updateName"
                  />
                  <el-tooltip v-else class="item" effect="dark" :content="data.name" placement="top-start">
                    <span>{{ data.name }}</span>
                  </el-tooltip>
                </div>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="com-searh-wrap">
          <div class="com-title-item">
            {{ tableTitle }}
          </div>
          <search
            :data="searchData"
            @search-reset="reset"
            @search-submit="searchSubmit"
          />
        </div>
        <div class="com-table-wrap">
          <div class="com-button-wrap">
            <el-button
              v-permission="'add'"
              v-ripples
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="showDialog('add')"
            >
              新增
            </el-button>
            <el-button
              v-permission="'dels'"
              v-ripples
              :disabled="multipleSelection.length === 0"
              :loading="delLoading"
              type="danger"
              icon="el-icon-delete"
              @click="delData"
            >
              删除
            </el-button>
          </div>
          <com-table
            selection
            :columns="columns"
            :data="listData"
            :loading="loading"
            @select-cell="selectCell"
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
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :top="'10vh'"
      :title="dialogTitle"
    >
      <component
        :is="dialogComponent"
        v-if="dialogVisible"
        :type="dialogType"
        :unid="unid"
        :tree-data="treeData"
        :default-value="seletTreeData ? seletTreeData.unid : '10000'"
        @closeDialog="closeDialog"
        @getData="getData"
      />
    </el-dialog>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import { Info, Detail } from './components'
export default {
  name: 'Accounts',
  components: {
    Info,
    Detail
  },
  mixins: [tableMixins],
  data() {
    return {
      tableTitle: '',
      searchData: [
        {
          label: '账号',
          value: '',
          type: 'input',
          placeholder: '请输入账号',
          field: 'account',
          clearable: true
        },
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
          title: '角色',
          key: 'roleName',
          render: (h, params, index) => {
            return h('span', params.roleList.filter(item => {
              return item && item.roleName
            }).map(citem => {
              return citem && citem.roleName
            }).join(','))
          }
        },
        {
          title: '状态',
          key: 'state',
          render: (h, params, index) => {
            return h('el-tag', {
              props: { type: params.state === 1 ? 'success' : 'danger' }
            }, params.state === 1 ? '启用' : '禁用')
          },
          width: '140px'
        },
        {
          title: '操作',
          width: '300px',
          key: 'action',
          render: (h, params, index) => {
            return h('div', [
              h('el-button', {
                props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
                on: { click: () => { this.showDialog('edit', params) } },
                directives: [
                  {
                    name: 'permission',
                    value: 'edit'
                  },
                  {
                    name: 'ripples'
                  }
                ]
              }, '编辑'),
              h('el-button', {
                props: { type: 'success', plain: true, size: 'mini', icon: 'el-icon-info' },
                on: { click: () => { this.showDialog('det', params, 'detail') } },
                directives: [
                  {
                    name: 'permission',
                    value: 'det'
                  },
                  {
                    name: 'ripples'
                  }
                ]
              }, '详情'),
              h('el-button', {
                props: { plain: true, size: 'mini', icon: 'el-icon-unlock' },
                on: { click: () => { this.resetPaw(params) } },
                directives: [
                  {
                    name: 'permission',
                    value: 'reset'
                  },
                  {
                    name: 'ripples'
                  }
                ]
              }, '重置')
            ])
          }
        }
      ],
      treeData: [], // 树形
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      seletTreeData: null, // 选中的数据
      seletTreeNode: null, // 选中的节点
      inputValue: '', // 编辑框的值
      addValue: '', // 新增框的值
      showEdit: false, // 是否显示编辑框
      showAdd: false // 是否显示新增
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    // 获取树形
    async getTree() {
      const res = await this.$api.accounts.treeList()
      if (res) {
        this.treeData = res
        this.tableTitle = this.treeData[0].name
      }
    },
    // 树形选中
    handleNodeClick(data, node) {
      this.seletTreeData = data
      this.seletTreeNode = node
      this.tableTitle = data.name
      this.defalutParams = Object.assign(this.defalutParams, { departmentId: this.seletTreeData.unid })
      this.defalutParams.pageNum = 1
      this.getList()
    },
    // 编辑树形
    editTree() {
      this.showAdd = false
      if (!this.seletTreeData) {
        this.$message.warning('请选择部门')
        return
      }
      this.showEdit = true
      this.$nextTick(() => {
        this.$refs['input' + this.seletTreeData.unid].focus()
        this.inputValue = this.seletTreeData.name
      })
    },
    // input 失去焦点
    inputBlur() {
      this.showEdit = false
      this.showAdd = false
      this.inputValue = ''
      this.addValue = ''
    },
    // 修改树形
    async updateName() {
      const params = {
        name: this.inputValue,
        unid: this.seletTreeData.unid,
        pid: this.seletTreeData.pid
      }
      const res = await this.$api.accounts.treeEdit(params)
      if (res) {
        this.seletTreeData.name = params.name
        this.inputBlur()
        this.tableTitle = params.name
        this.$message.success('编辑成功')
      }
    },
    // 显示新增
    showAddInput() {
      this.showAdd = true
      this.$nextTick(() => {
        this.$refs.addInput.focus()
      })
    },
    // 新增树形
    async addTree() {
      const params = {
        name: this.addValue,
        pid: this.seletTreeData ? this.seletTreeData.unid : '10000'
      }
      const res = await this.$api.accounts.treeAdd(params)
      if (res) {
        res.children = []
        if (this.seletTreeData) {
          this.seletTreeData.children.push(res)
        } else {
          this.treeData[0].children.push(res)
        }
        this.inputBlur()
        this.$message.success('新增成功')
      }
    },
    // 删除树形
    delTree() {
      if (!this.seletTreeData) {
        this.$message.warning('请选择需要删除的部门')
        return
      }
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.seletTreeData.unid
        const res = await this.$api.accounts.treeDel({ unids: ids })
        if (res) {
          this.$message.success('删除成功')
          const parent = this.seletTreeNode.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.unid === this.seletTreeData.unid)
          children.splice(index, 1)
        }
      })
    },
    // 重置密码
    resetPaw(row) {
      this.$confirm('确定重置该帐号密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = this.$api.accounts.resetPaw({ unid: row.unid })
        if (res) {
          this.$message.success('重置成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-tree-node__content {
  height: 50px;
  line-height: 50px;
}

.custom-tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.com-tree-wrap {
  // height: 88vh;
  height: auto;
  overflow: auto;
}
</style>
