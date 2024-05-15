<template>
  <div>
    <!-- <img src="@/assets/收款进度.svg" /> -->
    <el-card style="margin-right: 30px;">
      <div>
        <span style="font-size: 16px; font-family:'Times New Roman', Times, serif;font-weight: bold;">财务指标</span>
      </div>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <div class="grid-content bg-purple" style="display: flex;text-align: center;justify-content: center;">
            <img src="@/assets/收款进度.svg" width="25%" height="25%" style="margin-left: 20px; flex:3">
            <div style="display: flex; flex-direction: column; text-align: center;justify-content: center; flex: 7;">
              <span style="font-size: 36px;">{{ collection }}</span>
              <span style="font-size: 16px; margin-top: 10px;">应收账款</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style="display: flex;text-align: center;justify-content: center;">
            <img src="@/assets/付款进度.svg" width="25%" height="25%" style="margin-left: 20px; flex:3">
            <div style="display: flex; flex-direction: column; text-align: center;justify-content: center; flex: 7;">
              <span style="font-size: 36px;">{{ payment }}</span>
              <span style="font-size: 16px; margin-top: 10px;">应付账款</span>
            </div>
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="grid-content bg-purple" style="display: flex;text-align: center;justify-content: center;">
            <img src="@/assets/利润分析.svg" width="113px" height="99px" style="margin-left: 20px; flex:3">
            <div style="display: flex; flex-direction: column; text-align: center;justify-content: center; flex: 7;">
              <span style="font-size: 36px;">{{ collection - payment }}</span>
              <span style="font-size: 16px; margin-top: 10px;">利润总额</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <div id="line" style="width: 1200px; height: 400px; margin-top: 30px;"></div>
      {{ currentTime }}
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      paymentList: [],
      payment: 0,
      collectionList: [],
      collection: 0,
      currentTime: '',
      myChart: {},
      series: [],
      payData: [],
      collectionData: [],
      profitData: [],
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('line'));
    // 绘制图表
  },
  created() {
    // this.getCollectionDataList()
    // this.getPayDataList()
    this.getPaymentList()
    this.getCollectionList()
    Promise.all([this.getCollectionDataList(), this.getPayDataList()]).then(res => {
      console.log(this.collectionData, this.payData)
      this.getProfitData()

    })

    setTimeout(() => {
      this.series = [
        {
          name: '每月收入',
          type: 'line',
          data: this.collectionData
        },
        {
          name: '每月费用',
          type: 'line',
          data: this.payData
        },
        {
          name: '每月利润',
          type: 'line',
          data: this.profitData
        },
      ]
    }, 2000)
  },
  watch: {
    series: {
      handler() {
        this.myChart.setOption({
          title: {
            text: '财务分析（近一年）'
          },
          legend: {
            data: ['每月收入', '每月费用', '每月利润']
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // x轴
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {},
          series: this.series
        });
      },
      deep: true
    }
  },
  methods: {

    async getProfitData() {
      for (let i = 0; i < 12; i++) {
        console.log(this.collectionData[i])
        const collection = this.collectionData[i] || 0; // 如果值为 undefined 或 null，则置为 0
        const pay = this.payData[i] || 0; // 如果值为 undefined 或 null，则置为 0
        const profit = collection - pay;
        this.profitData.push(profit);
      }
      // console.log(this.profitData);
    },



    async getCollectionDataList() {
      const res = await axios({
        url: 'http://localhost:8080/voucher/voucher',
        method: 'get',
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          voucherWord: '收',
          bookID: localStorage.getItem('bookID')
        }
      });

      // 获取数据
      const data = res.data.data;

      // 计算每个月份的总金额
      const payData = {};
      data.forEach(item => {
        const month = dayjs(item.cime).format('YYYY-MM');
        if (!payData[month]) {
          payData[month] = 0;
        }
        payData[month] += parseFloat(item.totalAmount);
      });

      // 将结果按月份排序并转换为数组
      const sortedPayData = Object.entries(payData)
        .sort(([month1], [month2]) => month1.localeCompare(month2))
        .map(([month, total]) => total);
      this.collectionData = sortedPayData;
      // console.log(this.collectionData)
      // console.log(sortedPayData);
    },

    async getPayDataList() {
      const res = await axios({
        url: 'http://localhost:8080/voucher/voucher',
        method: 'get',
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          voucherWord: '付',
          bookID: localStorage.getItem('bookID')
        }
      });

      // 获取数据
      const data = res.data.data;

      // 计算每个月份的总金额
      const payData = {};
      data.forEach(item => {
        const month = dayjs(item.cime).format('YYYY-MM');
        if (!payData[month]) {
          payData[month] = 0;
        }
        payData[month] += parseFloat(item.totalAmount);
      });

      // 将结果按月份排序并转换为数组
      const sortedPayData = Object.entries(payData)
        .sort(([month1], [month2]) => month1.localeCompare(month2))
        .map(([month, total]) => total);
      this.payData = sortedPayData;
      // console.log(this.payData)
      // console.log(sortedPayData);
    },

    // 计算应收账款
    async getPaymentList() {
      const currentYearMonth = dayjs().format('YYYY-MM');
      const res = await axios({
        url: 'http://localhost:8080/voucher/voucher',
        method: 'get',
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          voucherWord: '付',
          bookID: localStorage.getItem('bookID')
        }
      });
      // 处理数据：将 cime 格式化为 'YYYY-MM' 的形式
      this.paymentList = res.data.data.map(item => ({
        ...item,
        cime: dayjs(item.cime).format('YYYY-MM')
      }));
      // console.log(this.paymentList);
      // 过滤出本月的数据
      this.paymentList = this.paymentList.filter(item => {
        // 比较年份月份是否与当前年份月份一致
        return item.cime === currentYearMonth;
      });
      // console.log(currentYearMonth);
      // console.log(this.paymentList);
      // 累加每个对象的totalAmount属性
      let totalPaymentAmount = 0;
      this.paymentList.forEach(payment => {
        totalPaymentAmount += parseFloat(payment.totalAmount);
      });
      this.payment = totalPaymentAmount;
      // console.log(this.payment)
    },

    // 计算应付账款
    async getCollectionList() {
      const currentYearMonth = dayjs().format('YYYY-MM');
      const res = await axios({
        url: 'http://localhost:8080/voucher/voucher',
        method: 'get',
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          voucherWord: '收',
          bookID: localStorage.getItem('bookID')
        }
      })
      this.collectionList = res.data.data.map(item => ({
        ...item,
        cime: dayjs(item.cime).format('YYYY-MM')
      }));
      // console.log(this.collectionList);
      this.collectionList = this.collectionList.filter(item => {
        return item.cime === currentYearMonth;
      })
      // console.log(this.collectionList);
      // 累加每个对象的totalAmount属性
      let totalPaymentAmount = 0;
      this.collectionList.forEach(payment => {
        totalPaymentAmount += parseFloat(payment.totalAmount);
      });
      this.collection = totalPaymentAmount;
    }

  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: rgb(249, 249, 249);
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>