import { post } from '../../axios'

export default {
  treeList: function(params) {
    return post(params, '/department/find')
  },
  treeEdit: function(params) {
    return post(params, '/department/update')
  },
  treeAdd: function(params) {
    return post(params, '/department/addDepartment')
  },
  treeDel: function(params) {
    return post(params, '/department/delete')
  },
  accountsList: function(params) {
    return post(params, '/userBack/find')
  },
  accountsAdd: function(params) {
    return post(params, '/userBack/insert')
  },
  accountsEdit: function(params) {
    return post(params, '/userBack/update')
  },
  accountsDet: function(params) {
    return post(params, '/userBack/findById')
  },
  accountsDel: function(params) {
    return post(params, '/userBack/delete')
  },
  // 重置密码
  resetPaw: function(params) {
    return post(params, '/userBack/reset')
  },
  editUser: function(params) {
    return post(params, '/userBack/updatePersonInfo')
  }
}
