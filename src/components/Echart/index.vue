<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json' // 引入默认主题
import resize from './mixins/resize' // 引入防抖混入选项
echarts.registerTheme('tdTheme', tdTheme) // 覆盖默认主题
export default {
  name: 'Echarts',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    options: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    options: {
      handler(options) {
        this.chart.setOption(this.options)
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // 初始化echart
      this.chart = echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options)
    }
  }
}
</script>

<style>
</style>
