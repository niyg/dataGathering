import { debounce } from '@/utils'

export default {
  data() {
    return {
      sidebarElm: null
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)

    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  activated() {
    // 防止keep-alive之后图表变形
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  }
}
