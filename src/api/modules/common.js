import { post } from '../axios'

export default {
  // 多文件上传
  uploads: function(parmas) {
    return post(parmas, '/fileUpload/dataFileuploads', 'multipart/form-data')
  },
  // 单文件上传
  upload: function(parmas) {
    return post(parmas, '/fileUpload/dataFileupload', 'multipart/form-data')
  },
  // 删除文件
  delFile: function(parmas) {
    return post(parmas, '/fileUpload/delFiles')
  },
  // 获取字典表
  getDict: function(parmas) {
    return post(parmas, '/dict/queryDictByDictType')
  },
  // 获取字典表
  getDicts: function(parmas) {
    return post(parmas, '/dict/queryDictsByDictType')
  },
  // 获取H5地址常量
  getH5Url: function(parmas) {
    return post(parmas, '/constant/findConstantByKey')
  }
}
