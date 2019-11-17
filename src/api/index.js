/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 11:05:01
 * @LastEditTime: 2019-10-09 11:05:01
 * @LastEditors: your name
 */
import common from './modules/common'
import login from './modules/login'
import auth from './modules/auth'

export default {
  common,
  login,
  ...auth
}
