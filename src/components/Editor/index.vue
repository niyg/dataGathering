<template>
  <div class="editor-wrapper">
    <div :id="editorId" />
  </div>
</template>

<script>
import Editor from 'wangeditor'
import { oneOf } from '@/utils'
import { isExternal } from '@/utils/validate'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * 是否允许编辑
     */
    isEdit: {
      type: Boolean,
      default: true
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editorId() {
      return `editor${this._uid}`
    }
  },
  watch: {
    value(newValue) {
      const bool = sessionStorage.editorInitVal === 'true'
      if (bool) {
        this.editor.txt.html(newValue)
        sessionStorage.editorInitVal = !bool // 修改功能填充值时请及时清除缓存，避免每次都刷新编辑器内容导致光标消失。
      }
    }
  },
  mounted() {
    const _self = this
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      const text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    // 自定义菜单配置
    if(this.isEdit) {
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      // 'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      'video', // 插入视频
      // 'code',  // 插入代码
      'undo' // 撤销
      // 'redo'  // 重复
    ]
    } else {
      this.editor.customConfig.menus = []
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // 插入链接的验证
    this.editor.customConfig.linkCheck = function(text, link) {
      if (isExternal(link)) {
        return true // 返回 true 表示校验成功
      } else {
        // _self.$message.error('请插入正确的网址链接')
        return '请插入正确的网址链接' // 返回字符串，即校验失败的提示信息
      }
    }
    this.editor.customConfig.customUploadImg = async function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      //       console.log(files)
      //       console.log(insert)
      const imgs = await _self.uploadImg(files)
      // 上传代码返回结果之后，将图片插入到编辑器中
      imgs.forEach((item, index) => {
        insert(`${_self.$config.source}${item.filePath}`)
      })
    }
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    const html = this.value || localStorage.editorCache
    if (html) {
      this.editor.txt.html(html)
    }
    this.isEdit ? this.editor.$textElem.attr('contenteditable', true) : this.editor.$textElem.attr('contenteditable', false)
  },
  methods: {
    setHtml(val) {
      this.editor.txt.html(val)
    },
    async uploadImg(files) {
      const formData = new FormData()
      files.forEach((item, index) => {
        formData.append('files', item)
      })
      formData.append('fileType', '0002')
      formData.append('uploadUser', '123')
      const res = await this.$api.common.uploads(formData)
      if (res) {
        return res
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper *{
  z-index: 10 !important;
}
</style>
