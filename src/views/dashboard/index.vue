<template>
  <div>
    <panel-group />
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="chart__wrap">
          <echart :options="pieOptions" :height="'300px'" />
        </div>
      </el-col>
      <el-col :span="14">
        <div class="chart__wrap">
          <echart :options="barOptions" :height="'300px'" />
        </div>
      </el-col>
    </el-row>
    <div class="chart__wrap">
      <echart :options="lineOptions" :height="'300px'" />
    </div>
  </div>
</template>

<script>
import Echart from '@/components/Echart'
import PanelGroup from './components/PanelGroup'
import { lineOptions, pieOptions, barOptions } from './data/echart-data'
export default {
  name: 'Dashboard',
  components: {
    Echart,
    PanelGroup
  },
  data() {
    return {
      lineOptions,
      pieOptions,
      barOptions
    }
  }
}
</script>

<style lang="less" scoped>
  .chart__wrap {
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: @content-bg;
    padding: 10px;
  }
</style>
