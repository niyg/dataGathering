<template>
  <div v-if="info" class="com-dialog-wrap">
    <div class="com-det-wrap">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="det-title-item">
            <span>用户头像</span>
            <span>
              <img
                v-lazy="{
                  src: $config.source + info.iconPath,
                  error: require('@/assets/img/err.png')
                }"
                class="avatar"
              >
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>登录账号</span>
            <span>{{ info.account }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>机构部门</span>
            <span>{{ info.departmentName }}</span>
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <div class="det-title-item">
            <span>密码</span>
            <span>{{ info.password }}</span>
          </div>
        </el-col> -->
        <el-col :span="12">
          <div class="det-title-item">
            <span>邮箱地址</span>
            <span>{{ info.email }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>姓名</span>
            <span>{{ info.name }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>联系电话</span>
            <span>{{ info.phone }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>工作职位</span>
            <span>{{ info.positon }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="det-title-item">
            <span>状态</span>
            <span>
              <el-tag :type="info.state === 1 ? 'success' : 'danger'">
                {{ info.state === 1 ? '启用' : '禁用' }}
              </el-tag>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="info.roleList" style="margin-top: 20px;">
      <div style="margin: 20px 0 10px 0;">
        角色权限列表
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
        :total="info.roleList.length"
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
import dialogMixins from '@/mixins/dialog-mixins'
import ComTable from '_c/ComTable'
import { formatTime } from '@/utils'
export default {
  components: {
    ComTable
  },
  mixins: [dialogMixins],
  data() {
    return {
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 5
      },
      columns: [
        {
          title: '角色名称',
          key: 'roleName'
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
      return this.info.roleList.slice((this.params.pageNum - 1) * this.params.pageSize, this.params.pageNum * this.params.pageSize)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.params.pageNum = val
    }
  }
}
</script>

<style>
</style>
