/**
 * 登录页面 Created by archer on 2019.03.23
 */
<template>
  <div class="login-wrap" @keydown.enter="canLogin">
    <div class="login-title-wrap">
      <span>{{title}}</span>
    </div>
    <div class="login">
      <div class="login-con">
        <el-card class="box-card">
          <div slot="header">
            <span class="login--header">登录</span>
          </div>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
          >
            <el-form-item prop="account">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="form.account"
                placeholder="请输入您的账号"
                class="form--input"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                v-model="form.password"
                placeholder="请输入您的密码"
                minlength="3"
                maxlength="18"
                show-password
                class="form--input"
              />
            </el-form-item>
            <el-form-item prop="code">
              <span class="svg-container">
                <svg-icon icon-class="code" />
              </span>
              <el-input
                v-model="form.code"
                placeholder="请输入验证码"
                class="imgcode"
                clearable
              />
              <div class="code-value">
                <img :src="imgSrc" alt="图片加载失败">
              </div>
              <a class="change-code" @click="changeCode">换一张</a>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                class="login--button"
                @click="canLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="login-footer-wrap">
      <span>Copyright ©  福建三元达控股有限公司, All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import path from 'path'
import jsMd5 from 'js-md5'
import { deepClone, } from '@/utils'
export default {
  name: 'Login',
  data() {
    // 自定义表单验证
    const validateCode = async(rule, value, callback) => {
      if (value) {
        const params = {
          kaptchaToken: this.imgId,
          kaptchaCode: value
        }
        const res = await this.$api.login.checkCode(params)
        if (res) {
          callback()
        } else {
          callback(new Error('请输入正确的验证码'))
        }
      } else {
        callback(new Error('验证码不能为空'))
      }
    }
    return {
      title:this.$config.title,
      loading: false,
      redirect: '',
      form: {
        account: '',
        password: '',
        code: ''
      },
      rules: {
        account: [{ required: true, message: '账号不能为空' }],
        password: [{ required: true, message: '密码不能为空' }],
        code: [{ validator: validateCode, trigger: 'submit' }]
      },
      imgId: '',
      imgSrc: '',
      roleAuth: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    // 获取验证码
    async getCode() {
      const res = await this.$api.login.getCode()
      if (res) {
        this.imgId = res.kaptchaToken
        this.imgSrc = `data:image/png;base64,${res.BASE64Img}`
      }
    },
    // 更换验证码
    changeCode() {
      this.form.code = ''
      this.getCode()
    },
    // 登录验证
    canLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 登录
    async login() {
      const params = {
        account: this.form.account,
        // password: this.form.password,
        password: jsMd5(this.form.password),
        type: 2
      }
      const res = await this.$api.login.login(params)
      if (res) {
        if (!res.roleAuth || (res.roleAuth && JSON.parse(res.roleAuth).length === 0)) {
          this.$message.error('该账号没有访问权限，请联系管理员')
        } else {
          this.$wsCache.set('userInfo', res)
          this.$store.dispatch('GenerateRoutes').then(() => {
            this.$router.options.routes = this.$store.getters.routers
            this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
            this.$router.push({ path: path.resolve(this.$store.getters.addRouters[0].path, this.$store.getters.addRouters[0].children[0].path) })
          })
        }
        this.loading = false
      } else {
        this.changeCode()
        this.loading = false
      }
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (const route of routes) {
        // skip some route
        if (route.hidden) { continue }

        let onlyOneChild = null

        if (route.children && route.children.length === 1) {
          onlyOneChild = path.resolve(route.path, route.children[0].path)
        }

        let data = null

        for (const item of this.roleAuth) {
          if (path.resolve(basePath, onlyOneChild || route.path) === item.path) {
            data = deepClone(route)
            data.meta.btnRoles = item.btnRoles ? item.btnRoles : []
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
.login-wrap {
  width: 100%;
  height: 100%;
}
.login-title-wrap {
  width: 100%;
  height: 90px;
  background: #008aff;
  font-family: FZQIANGKTS_CU--GB1-0;
	font-size: 40px;
	color: #fff;
  line-height: 90px;
  span {
    padding-left: 105px;
  }
}
.login-footer-wrap {
  width: 100%;
  height: 80px;
  text-align: center;
  background: #eaeaea;
  line-height: 80px;
  color: #2c3b58;
  font-family: MicrosoftYaHei;
	font-size: 14px;
}
.login{
  width: 100%;
  height: calc(~"100% - 170px");
  background-image: url('../../assets/img/login-bg.png');
  background-size: cover;
  background-position: center;
  position: relative;
  .box-card {
    width: 400px;
    .login--header {
      font-size: 24px;
      font-weight: 600;
    }
    .svg-container {
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .form--input {
      width: 85%;
    }
    .login--button {
      width: 100%;
    }
  }
  &-con{
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
  }
  .imgcode {
    width: 40%;
  }
  .code-value {
    display: inline-block;
    width: 105px;
    height: 41px;
    box-sizing: border-box;
    vertical-align: bottom;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    margin: 0px 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .change-code {
    cursor: pointer;
    color: #454545;
  }
}
</style>
