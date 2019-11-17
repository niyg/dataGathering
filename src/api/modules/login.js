import { get, post } from '../axios'

export default {
  // 获取验证码
  getCode: function(parmas) {
    return get(parmas, '/userBack/kaptchaImg')
  },
  // 验证验证码
  checkCode: function(params) {
    return post(params, '/userBack/validateKaptchaImg')
  },
  // 登录
  login: function(params) {
    return post(params, '/userBack/login')
  },
  loginOut: function(params) {
    return post(params, '/user/logout')
  },
  changePwd: function(params) {
    return post(params, '/userBack/updatePassword')
  }
}
