<template>
  <div v-if="info" class="com-dialog-wrap">
    <div class="com-det-wrap">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="det-title-item">
            <span>角色名称</span>
            <span>{{ info.roleName }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>角色分类</span>
            <span>{{ info.pidName }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>菜单权限</span>
            <span>
              <el-tree
                ref="tree"
                :check-strictly="checkStrictly"
                :default-checked-keys="defaultKey"
                :data="routesData"
                :props="defaultProps"
                accordion
                node-key="path"
                highlight-current
                class="permission-tree"
                @node-click="handleNodeClick"
              />
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>按钮权限</span>
            <span v-if="seletTreeData && seletTreeData.roles">
              <span
                v-for="(item, $index) in seletTreeData.roles"
                :key="$index"
                :label="item"
                disabled
                border
              >
                {{ item | filterRole }}
              </span>
            </span>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="det-title-item">
            <span>备注</span>
            <span>{{ info.description }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="info.userList" style="margin-top: 20px;">
      <div style="margin: 20px 0 10px 0;font-weight: bold;">
        账号列表
      </div>
      <div class="com-table-wrap">
        <com-table
          :columns="columns"
          :data="filterData"
          border
        />
      </div>
      <el-pagination
        :current-page.sync="params.pageNum"
        :page-size="params.pageSize"
        :total="info.userList.length"
        layout="prev, pager, next, jumper"
        class="com-table-pagination"
        @current-change="handleCurrentChange"
      />
    </div>
    <footer class="com-footer-wrap">
      <el-button v-ripples @click="closeDialog">
        取 消
      </el-button>
    </footer>
  </div>
</template>

<script>
import path from 'path'
import dialogMixins from '@/mixins/dialog-mixins'
import ComTable from '_c/ComTable'
import { formatTime } from '@/utils'
import { roles } from '@/utils/common'
import { asyncRouterMap } from '@/router'
export default {
  components: {
    ComTable
  },
  filters: {
    filterRole(val) {
      return roles[val]
    }
  },
  mixins: [dialogMixins],
  data() {
    return {
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      routes: [],
      defaultKey: [],
      seletTreeData: null,
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 5
      },
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
          title: '创建时间',
          key: 'createTime',
          render: (h, params, index) => {
            return h('span', formatTime('yyyy-MM-dd HH:mm:ss', params.createTime))
          }
        }
      ]
    }
  },
  computed: {
    filterData() {
      return this.info.userList.slice((this.params.pageNum - 1) * this.params.pageSize, this.params.pageNum * this.params.pageSize)
    },
    routesData() {
      return this.routes
    }
  },
  methods: {
    // 获取详情之后的回调
    afterGet(res) {
      this.info = res
      if (res.auth) {
        this.routes = this.generateRoutes(asyncRouterMap)
      }
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
    },
    // 树形点击
    handleNodeClick(data, node) {
      this.seletTreeData = data
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (const route of routes) {
        // skip some route
        if (route.hidden) { continue }

        let onlyOneChild = null

        if (route.children && route.children.length === 1 && !route.alwaysShow) {
          onlyOneChild = path.resolve(route.path, route.children[0].path)
          /* eslint-disable */
          route = route.children[0]
          /* eslint-disable */
        }

        let data = null
        for (const item of JSON.parse(this.info.auth)) {
          if (path.resolve(basePath, onlyOneChild || route.path) === item.path) {
            data = {
              path: path.resolve(basePath, route.path),
              title: route.meta && route.meta.title,
              roles: item.btnRoles
            }
            if (route.children) {
              data.children = []
            }
          }
        }

        // recursive child routes
        if (route.children && data) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        if (data) {
          res.push(data)
        }
      }
      return res
    }

  }
}
</script>

<style lang="less" scoped>
.roles-item {
  /deep/ .el-checkbox {
    margin: 0 !important;
    display: block;
    margin-top: 10px !important;
  }
}
</style>
