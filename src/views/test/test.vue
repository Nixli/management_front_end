<template>
    <div id="chart" style="width: 600px; height: 400px;"></div>
  </template>
  
  <script>

  import * as echarts from 'echarts';
  export default {
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      // 初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'));
  
      // 设置echarts配置项
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      };
  
      // 使用配置项绘制图表
      this.chart.setOption(option);
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  