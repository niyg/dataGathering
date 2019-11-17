import { post } from '../../axios'

export default {
  treeList: function(params) {
    return post(params, '/roleManager/findRoleTree')
  },
  treeAdd: function(params) {
    return post(params, '/roleManager/insert')
  },
  treeEdit: function(params) {
    return post(params, '/roleManager/update')
  },
  treeDel: function(params) {
    return post(params, '/roleManager/delete')
  },
  roleList: function(params) {
    return post(params, '/roleManager/find')
  },
  roleAdd: function(params) {
    return post(params, '/roleManager/insert')
  },
  roleEdit: function(params) {
    return post(params, '/roleManager/update')
  },
  roleDet: function(params) {
    return post(params, '/roleManager/findById')
  },
  roleDel: function(params) {
    return post(params, '/roleManager/delete')
  }
}
