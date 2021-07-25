<template>
  <el-card class="box-card">
    <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 750px; height: 400px"></div>
  </el-card>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'
import { getChartData } from 'network/home/report.js'

export default {
  name: 'ReportsCard',
  data() {
    return {
      // 需要合并到折线图中的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    // 画图表
    async drawChart() {
      // 3.基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'))

      // 发起获取折线图的网络请求
      const res = await getChartData()
      if (res.meta.status !== 200)
        return this.$message.error('折线图数据获取失败!')

      // 4.准备数据和配置项
      const result = _.merge(res.data, this.options)

      // 5.展示数据
      myChart.setOption(result)
    },
  },
}
</script>

<style lang="less" scoped>
</style>