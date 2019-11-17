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
          <el-form-item label="用户头像" prop="iconPath">
            <div class="avatar-item">
              <img
                v-if="formInline.iconPath"
                :src="formInline.iconPath"
                class="avatar"
                @click.self="showDialog('Upload', '上传头像')"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploade-icon"
                @click.self="showDialog('Upload', '上传头像')"
              />
              <svg-icon
                v-if="formInline.iconPath"
                icon-class="close"
                class="del-item"
                @click="delAvatar"
              />
            </div>
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="formInline.account" placeholder="请输入登录账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formInline.password"
              show-password
              placeholder="******"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构部门" prop="departmentId">
            <tree-select
              :props="{
                value: 'unid',
                label: 'name',
                children: 'children'
              }"
              :value="formInline.departmentId"
              :options="treeData"
              :clearable="false"
              :accordion="true"
              placeholder="请选择机构部门"
              style="width: 100%;"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item label="工作职位" prop="positon">
            <el-input v-model="formInline.positon" placeholder="请输入工作职位" />
          </el-form-item>

          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="formInline.email" placeholder="请输入邮箱地址" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formInline.phone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-switch v-model="formInline.state" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="系统角色" prop="roles">
        <el-input
          v-model="formInline.roles"
          disabled
          placeholder="请选择系统角色"
          style="width: 75%;margin-right: 20px;"
        />
        <el-button
          v-ripples
          type="primary"
          @click="showDialog('SelectRoles', '选择角色')"
        >
          选择角色
        </el-button>
      </el-form-item>
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
      :width="comType === 'SelectRoles' ? '1200px' : ''"
      :title="comTitle"
      append-to-body
    >
      <component
        :is="comType"
        v-if="visible"
        :src="formInline.iconPath"
        :right-data="formInline.rolesArr"
        @closeDialog="closeCitemDialog"
        @selectRoles="selectRoles"
        @on-crop="handleCroped"
      />
    </el-dialog>
  </div>
</template>

<script>
import jsMd5 from 'js-md5'
import Upload from './Upload'
import SelectRoles from './SelectRoles'
import TreeSelect from '_c/TreeSelect'
import dialogMixins from '@/mixins/dialog-mixins'
import { isEmail, isPhone } from '@/utils/validate'
import { base64ToFile, deepClone } from '@/utils'
export default {
  components: {
    Upload,
    TreeSelect,
    SelectRoles
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
    // 自定义表单验证
    const validateEmail = (rule, value, callback) => {
      if (isEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (isPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系电话'))
      }
    }
    return {
      // 表单数据
      formInline: {
        account: '', // 账号
        password: '', // 密码
        name: '', // 姓名
        email: '', // 邮箱
        phone: '', // 联系方式
        departmentId: '', // 部门
        roleId: '', // 角色
        positon: '', // 职位
        state: true, // 状态
        iconId: '', // 头像ID
        iconPath: '', // 头像路径
        roles: ''
      },
      // 表单验证
      ruleInline: {
        account: [
          { required: true, message: '请输入登录账号' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符' }
        ],
        password: [
          { required: false, message: '请输入密码' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符' }
        ],
        name: [
          { required: true, message: '请输入姓名' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
        ],
        phone: [
          { required: true, message: '请输入联系电话' },
          { validator: validatePhone }
        ],
        departmentId: [
          { required: true, message: '请选择机构部门' }
        ],
        roles: [
          { required: true, message: '请选择系统角色' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { validator: validateEmail }
        ]
      },
      uploadObj: null, // 上传对象
      visible: false, // 是否显示弹窗
      comType: '', // 弹窗组件
      comTitle: '' // 弹窗标题
    }
  },
  created() {
    if (this.type === 'add') {
      this.formInline.departmentId = this.defaultValue
      this.ruleInline.password[0].required = true
    }
  },
  methods: {
    // 显示弹窗
    showDialog(type, title) {
      this.comTitle = title
      this.comType = type
      this.visible = true
    },
    // 裁剪图片回调
    handleCroped(val) {
      this.visible = false
      this.formInline.iconPath = val
      this.uploadObj = base64ToFile(val)
    },
    // 删除头像
    async delAvatar() {
      if (this.formInline.iconId) {
        const res = await this.$api.common.delFile({ ids: this.formInline.iconId })
        if (res) {
          this.formInline.iconId = ''
          this.formInline.iconPath = ''
          this.info.iconId = ''
          this.info.iconPath = ''
          this.uploadObj = null
        }
      } else {
        this.formInline.iconId = ''
        this.formInline.iconPath = ''
        this.info.iconId = ''
        this.info.iconPath = ''
        this.uploadObj = null
      }
    },
    // 树形选择器回调
    getValue(val) {
      this.formInline.departmentId = val
    },
    // 提交之前做的处理
    beforeSub() {
      this.uploadImg()
    },
    // 上传图片
    async uploadImg() {
      const params = {
        state: this.formInline.state ? 1 : 0
      }
      if (this.uploadObj) {
        const formData = new FormData()
        formData.append('file', this.uploadObj)
        formData.append('fileType', '0001')
        formData.append('uploadUser', this.$wsCache.get('userInfo').userBack.unid)
        const res = await this.$api.common.upload(formData)
        if (res) {
          params.iconId = res.unid
          params.iconPath = res.filePath
          const oldParams = deepClone(this.formInline)
          const newParams = Object.assign(oldParams, params)
          newParams.roleId = oldParams.rolesArr.map((item, index) => {
            return item.unid
          }).join(',')
          if(newParams.password)newParams.password = jsMd5(newParams.password)
          delete newParams.rolesArr
          delete newParams.roles
          this.subData(newParams)
        }
      } else {
        const oldParams = deepClone(this.formInline)
        const newParams = Object.assign(oldParams, params)
        newParams.roleId = oldParams.rolesArr.map((item, index) => {
          return item.unid
        }).join(',')
        if(newParams.password)newParams.password = jsMd5(newParams.password)
        newParams.iconPath = (this.info && this.info.iconPath) || ''
        delete newParams.rolesArr
        delete newParams.roles
        this.subData(newParams)
      }
    },
    // 获取详情之后的回调
    afterGet(res) {
      this.info = deepClone(res)
      const params = {
        state: res.state === 1,
        iconPath: res.iconPath ? this.$config.source + res.iconPath : ''
      }
      const newParams = Object.assign(res, params)
      for (const key in this.formInline) {
        this.$set(this.formInline, key, newParams[key])
      }
      this.$set(this.formInline, 'roles', res.roleList.map((item, index) => {
        return item.roleName
      }).join(','))
      this.$set(this.formInline, 'rolesArr', res.roleList)
    },
    // 关闭弹窗
    closeCitemDialog(val) {
      this.visible = val
    },
    // 保存角色
    selectRoles(arr) {
      this.formInline.rolesArr = arr
      this.formInline.roles = arr.map((item, index) => {
        return item.roleName
      }).join(',')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-item {
  width: 95px;
  height: 95px;
  text-align: center;
  position: relative;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
  i {
    width: 95px;
    height: 100%;
    font-size: 30px;
    line-height: 95px;
    background: #dedede;
  }
  .del-item {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
    cursor: pointer;
  }
}
</style>
