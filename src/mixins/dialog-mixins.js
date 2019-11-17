/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 11:05:01
 * @LastEditTime: 2019-10-11 17:00:21
 * @LastEditors: Please set LastEditors
 */
export default {
  props: {
    unid: {
      type: String,
      default: ''
    },
    punid: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    get: { // 是否需要调用详情接口
      type: Boolean,
      default: true
    },
    infoApi: {
      type: Function
    },
    otherData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      subLoading: false, // 提交loading
      defalutParams: {
        unid: null
      },
      paramsData: null,
      info: null, // 详情
      labelPosition: 'right', // 文本位置
      labelWidth: '110px' // 文本宽度
    }
  },
  async created() {
    if (this.unid) {
      this.defalutParams.unid = this.unid
      this.defalutParams.userId = this.unid
      if (this.beforeGet) {
        await this.beforeGet()
      }
      if (this.get) {
        this.getDet()
      } else {
        this.info = this.row
        for (const key in this.formInline) {
          if (this.info[key]) {
            this.$set(this.formInline, key, this.info[key])
          }
        }
      }
    }
    // if (this.userId) {
    //   this.getDet()
    // }
  },
  methods: {
    // 获取列表数据
    async getDet() {
      let res = null
      if (this.infoApi) {
        res = await this.infoApi(Object.assign(this.defalutParams, this.otherParams))
      } else {
        res = await this.$api[this.$route.meta.module][this.$route.meta.request.det](Object.assign(this.defalutParams, this.otherParams))
      }
      if (res) {
        if (this.afterGet) {
          this.afterGet(res)
        } else {
          this.info = res
          for (const key in this.formInline) {
            if (this.info[key]) {
              this.$set(this.formInline, key, this.info[key])
            }
          }
        }
      }
      return res
    },
    // 表单验证
    submitForm(formName, api, data) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.beforeSub) {
            this.beforeSub()
          } else {
            if (data) {
              this.paramsData = data
            }
            this.subData('', api)
          }
        } else {
          return false
        }
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog', false)
    },
    // 提交数据
    async subData(data, api) {
      this.subLoading = true
      let res = null

      if (this.unid) {
        const params = {
          unid: this.unid
        }
        res = await this.$api[this.$route.meta.module][api || this.$route.meta.request.edit](Object.assign(data || this.formInline, params, this.paramsData))
      } else {
        res = await this.$api[this.$route.meta.module][this.$route.meta.request.add](data || this.formInline)
      }
      if (res) {
        this.$emit('getData', this.unid)
        this.$message.success(this.unid ? '编辑成功' : '新增成功')
        if (this.isUpdate) {
          this.$bus.$emit('upDateNum')
        }
      }
      this.subLoading = false
    }
  }
}
