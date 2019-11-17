<template>
  <div class="com-dialog-wrap">
    <el-form
      ref="ruleForm"
      :model="formInline"
      :rules="ruleInline"
      :label-position="labelPosition"
      :label-width="labelWidth"
      @submit.native.prevent
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formInline.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色分类" prop="pid">
            <tree-select
              :props="{
                value: 'unid',
                label: 'roleName',
                children: 'children'
              }"
              :value="formInline.pid"
              :options="treeData"
              :clearable="false"
              :accordion="true"
              placeholder="角色分类"
              style="width: 100%;"
              @getValue="getValue($event)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="分配账号" prop="userId">
        <el-input
          v-model="formInline.users"
          disabled
          placeholder="请选择系统账号"
          style="width: 75%;margin-right: 20px;"
        />
        <el-button
          v-ripples
          type="primary"
          @click="showDialog('SelectAccounts', '选择账号')"
        >
          选择账号
        </el-button>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="formInline.description"
          type="textarea"
          placeholder="请输入备注"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色权限">
            <el-tree
              ref="tree"
              :check-strictly="checkStrictly"
              :default-checked-keys="defaultKey"
              :data="routesData"
              :props="defaultProps"
              show-checkbox
              accordion
              node-key="path"
              highlight-current
              class="permission-tree"
              @node-click="handleNodeClick"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="按钮权限" class="roles-item">
            <el-checkbox-group v-if="seletTreeData && seletTreeData.roles" v-model="seletTreeData.btnRoles">
              <el-checkbox
                v-for="(item, $index) in seletTreeData.roles"
                :key="$index"
                :label="item"
                border
              >
                {{ item | filterRole }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="com-footer-wrap">
      <el-button
        v-ripples
        :loading="subLoading"
        type="primary"
        @click="submitForm('ruleForm')"
      >
        提 交
      </el-button>
      <el-button v-ripples @click="closeDialog">
        取 消
      </el-button>
    </footer>
    <el-dialog
      :visible.sync="visible"
      top="10vh"
      width="1200px"
      :title="comTitle"
      append-to-body
    >
      <component
        :is="comType"
        v-if="visible"
        :right-data="formInline.userArr"
        @closeDialog="closeCitemDialog"
        @selectAccounts="selectAccounts"
      />
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import SelectAccounts from './SelectAccounts'
import TreeSelect from '_c/TreeSelect'
import dialogMixins from '@/mixins/dialog-mixins'
import { deepClone } from '@/utils'
import { roles } from '@/utils/common'
import { constantRouterMap, asyncRouterMap } from '@/router'
import jsMd5 from 'js-md5';
export default {
  components: {
    SelectAccounts,
    TreeSelect
  },
  filters: {
    filterRole(val) {
      return roles[val]
    }
  },
  mixins: [dialogMixins],
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表单数据
      formInline: {
        roleName: '', // 名称
        description: '', // 备注
        pid: '', // 分类
        users: ''
      },
      // 表单验证
      ruleInline: {
        roleName: [
          { required: true, message: '请输入角色名称' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符' }
        ],
        pid: [
          { required: true, message: '请选择角色分类' }
        ]
      },
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      routes: [],
      defaultKey: [],
      seletTreeData: null,
      visible: false, // 是否显示弹窗
      comType: '', // 弹窗组件
      comTitle: '' // 弹窗标题
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    if (this.type === 'add') {
      this.formInline.pid = this.defaultValue
      //处理菜单和按钮的权限id，由前端通过path+name组合生成
      let newasyncRouterMap = this.transformRoute(deepClone(asyncRouterMap))
      const oldRoutes = [...constantRouterMap, ...newasyncRouterMap]
      this.routes = this.generateRoutes(oldRoutes)
    }
  },
  methods: {
    transformRoute(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        if(route.hidden) continue
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
         if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        debugger
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          roles: route.meta && this.renderRoleId(path.resolve(basePath, route.path), route.meta.roles),
          btnRoles: []
        }
        if (this.unid) {
          JSON.parse(this.formInline.auth).forEach((item, index) => {
            if (item.path === data.path && item.btnRoles) {
              data.btnRoles = deepClone(item.btnRoles) || []
            } else if (item.path === data.path && !item.btnRoles) {
              data.btnRoles = deepClone((route.meta && data.roles) || [])
            }
          })
        } else {
          data.btnRoles = deepClone((route.meta && data.roles) || [])
        }

        // recursive child routes
        if (route.children) {
          data.children = this.transformRoute(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    renderRoleId(path, roles) {
      if(roles) {
        return roles.map((item)=>{
          let obj = {}
          obj[item] = jsMd5(path+item)
          return obj
        })
      }else{
        return []
      }
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          roles: route.meta && route.meta.roles,
          btnRoles: []
        }
        if (this.unid) {
          JSON.parse(this.formInline.auth).forEach((item, index) => {
            if (item.path === data.path && item.btnRoles) {
              data.btnRoles = deepClone(item.btnRoles) || []
            } else if (item.path === data.path && !item.btnRoles) {
              data.btnRoles = deepClone((route.meta && route.meta.roles) || [])
            }
          })
        } else {
          data.btnRoles = deepClone((route.meta && route.meta.roles) || [])
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    // 树形选择器回调
    getValue(val) {
      this.formInline.pid = val
    },
    // 获取详情之后的回调
    afterGet(res) {
      this.formInline.roleName = res.roleName
      this.formInline.pid = res.pid
      this.formInline.description = res.description
      this.$set(this.formInline, 'userArr', res.userList)
      this.formInline.users = res.userList.map((item, index) => {
        return item.name
      }).join(',')
      this.formInline.auth = res.auth
      if (res.auth) {
        this.$nextTick(() => {
          const result = JSON.parse(res.otherAuth)
          this.$refs.tree.setCheckedNodes(result)
        })
      }
       let newasyncRouterMap = this.transformRoute(deepClone(asyncRouterMap))
      console.log(newasyncRouterMap)
      debugger
      const oldRoutes = [...constantRouterMap, ...asyncRouterMap]
      this.routes = this.generateRoutes(oldRoutes)
    },
    // 树形点击
    handleNodeClick(data, node) {
      debugger
      this.seletTreeData = data
    },
    // 显示弹窗
    showDialog(type, title) {
      this.comTitle = title
      this.comType = type
      this.visible = true
    },
    // 关闭弹窗
    closeCitemDialog(val) {
      this.visible = val
    },
    // 保存帐号
    selectAccounts(arr) {
      this.formInline.userArr = arr
      this.formInline.users = arr.map((item, index) => {
        return item.name
      }).join(',')
      this.visible = false
    },
    // 提交之前做的处理
    beforeSub() {
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const checkeds = this.$refs.tree.getCheckedNodes()
      const params = {
        pid: this.formInline.pid,
        roleName: this.formInline.roleName,
        type: 2,
        auth: JSON.stringify(checkedNodes),
        otherAuth: JSON.stringify(checkeds),
        description: this.formInline.description,
        userId: this.formInline.userArr ? this.formInline.userArr.map((item, index) => {
          return item.unid
        }).join(',') : ''
      }
      this.subData(params)
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
/deep/ .el-tree-node__label {
  padding-left: 10px;
}
</style>
