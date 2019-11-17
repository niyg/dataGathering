/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 11:05:01
 * @LastEditTime: 2019-11-12 19:07:37
 * @LastEditors: Please set LastEditors
 */
import Search from '_c/Search'
import ComTable from '_c/ComTable'

export default {
  components: {
    Search,
    ComTable
  },
  data() {
    return {
      loading: false, // 加载loading
      delLoading: false, // 删除loading
      putAwayLoading: false, // 上架loading
      soldOutLoading: false, // 下架loading
      moveUpLoading: false, // 上移loading
      moveDownLoading: false, // 下移loading
      listData: [], // 表格数据
      total: 0, // 总条数
      defalutParams: {
        pageNum: 1,
        pageSize: 10
      },
      dialogType: '', // 弹窗类型
      dialogTitle: '', // 弹窗标题
      dialogVisible: false, // 是否显示弹窗
      dialogComponent: '', // 组件名称
      multipleSelection: [], // 表格选中数据
      unid: null, // 列表ID
      filterTime: 'yyyy-MM-dd HH:mm:ss',
      info: null
    }
  },
  created() {
    if (this.beforeGetList) {
      this.beforeGetList()
    } else {
      this.getList()
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.loading = true
      try {
        const res = await this.$api[this.$route.meta.module][this.$route.meta.request.list](Object.assign(this.defalutParams, this.otherParams))
        if (res) {
          this.listData = res.content
          this.total = res.totalElements
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    // 查询
    searchSubmit(row) {
      if (this.beforeSearch) {
        this.beforeSearch(row)
      } else {
        this.defalutParams = Object.assign(this.defalutParams, row)
        this.defalutParams.pageNum = 1
        this.getList()
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.defalutParams.pageNum = val
      this.getList()
    },
    // 显示弹窗
    showDialog(type, row, component, title) {
      sessionStorage.editorInitVal = true
      this.dialogType = type
      if (title) {
        this.dialogTitle = title
      } else {
        this.dialogTitle = type === 'add' ? '新增' : (type === 'edit' ? '编辑' : (type === 'select' ? '选择应用' : '详情'))
      }
      this.dialogVisible = true
      if (row) {
        this.unid = row.unid + ''
        this.row = row
      } else {
        this.unid = null
        this.row = null
      }
      this.dialogComponent = component || 'Info'
    },
    // 关闭弹窗
    closeDialog(val) {
      this.dialogVisible = val
    },
    // 更新列表
    getData(type) {
      if (!type) {
        this.defalutParams.pageNum = 1
      }
      this.dialogVisible = false
      this.getList()
    },
    // 重置表单
    reset(row) {
      if (this.beforeReset) {
        this.beforeReset(row)
      } else {
        // this.defalutParams = Object.assign(this.defalutParams, row)
        this.defalutParams = {}
        this.defalutParams.pageNum = 1
        this.defalutParams.pageSize = 10
        delete this.defalutParams.startTime
        delete this.defalutParams.endTime
        this.getList()
      }
    },
    // 批量删除
    delData(title) {
      if (this.multipleSelection.length === 0) {
        return
      }
      this.$confirm((typeof title === 'string' ? title : '') || '此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.delLoading = true
        const unids = this.multipleSelection.map(item => {
          return item.unid
        }).join(',')
        const res = await this.$api[this.$route.meta.module][this.$route.meta.request.del]({
          unids: unids
        })
        if (res) {
          this.$message.success('处理成功')
          this.defalutParams.pageNum = 1
          this.getList()
        }
        this.delLoading = false
      })
    },
    // 删除单条
    delOne(data, tip) {
      this.$confirm(tip || '此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.delLoading = true
        const res = await this.$api[this.$route.meta.module][this.$route.meta.request.del](data)
        if (res) {
          this.$message.success('删除成功')
          this.defalutParams.pageNum = 1
          this.getList()
        }
        this.delLoading = false
      })
    },
    // 多选
    selectCell(val) {
      this.multipleSelection = val
    }
  }
}
