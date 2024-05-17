<template>
  <div style="height: auto; width: auto">
    <el-card>
      <div style="display: flex; flex-direction: row">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <!-- 菜系下拉列表框 -->
          <el-form-item label="菜系">
            <el-select v-model="params.dishID" class="filter-item" placeholder="请选择菜系">
              <el-option v-for="(dish, index) in dishIDList" :label="dish.dishType" :value="dish.dishID"></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间 -->
          <el-form-item label="根据月份查询">
            <el-date-picker v-model="params.beginTime" type="date" placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="params.endTime" type="date" placeholder="截止日期">
            </el-date-picker>
          </el-form-item>

          <!-- 搜索按钮 -->
          <el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 图形区域 -->
    <el-card>
      <div id="chart" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import * as echarts from "echarts";
export default {
  data() {
    return {
      //图表
      chart: null,
      //小类菜名
      nameList: [],
      //销量
      countList: [],
      //大类菜名
      dishIDList: '',
      // 搜索条件
      params: {
        //大类ID
        //dishID:1,
        dishID:localStorage.getItem('dishID'),
        beginTime: undefined,
        endTime: undefined
      },
    };
  },
  mounted() { //最早获取DOM元素的生命周期函数，挂载完毕
    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  created() {
    //获取大类集合
    this.getDishIDList();
  },
  methods: {
     setOption(){
        // 初始化echarts实例
        this.chart = echarts.init(document.getElementById("chart"));
        this.chart.setOption({
          title: {
              text: '菜品销量统计'
          },
          tooltip: {
              trigger: 'item' // 当鼠标悬浮在坐标轴上时触发
          },
          xAxis: {
            type: "category",
            data: this.nameList,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name:this.nameList,
              data: this.countList,
              type: "bar",
            },
          ],
        });
     },
    // open(msg) {
    //     this.$message({
    //       message: msg,
    //       type: 'success'
    //     });
    //   },

    //查询该门店的所有菜品大类
   async getDishIDList(){
      const res = await axios({
        method: "get",
        url: "http://localhost:8080/dish/findDishByStoreID",
        params: {
          //storeId: 1,
        },
      });
      //console.log(this.params)
      console.log(res.data.data);
      this.dishIDList = res.data.data;
    },

    //查询小类名字
    async getNameList(){
      const formattedParams = {
          ...this.params,
          beginTime: this.params.beginTime ? dayjs(this.params.beginTime).format('YYYY-MM-DD HH:mm:ss') : null,
          endTime: this.params.endTime ? dayjs(this.params.endTime).format('YYYY-MM-DD HH:mm:ss') : null,
      };
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/dishes/getDishesNameList",
        params: {
          //storeId: 1,
          ...formattedParams,
        },
      });
      console.log(res);
      this.nameList = res.data.data;
      if(this.nameList==null){
        this.$notify.info({
          title: '消息',
          message: '该菜系暂未售出'
        });
      }else{
        this.$notify({
          title: '成功',
          message: '查询成功',
          type: 'success'
        });
      }
      //在渲染 图形
      this.$nextTick(() => {
        this.setOption();
      })
    },

    //查询小类销量
    async getCountList(){
      const formattedParams = {
          ...this.params,
          beginTime: this.params.beginTime ? dayjs(this.params.beginTime).format('YYYY-MM-DD HH:mm:ss') : null,
          endTime: this.params.endTime ? dayjs(this.params.endTime).format('YYYY-MM-DD HH:mm:ss') : null,
      };
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/dishes/getDishesCountList",
        params: {
          //storeId: 1,
          ...formattedParams,
        },
      });
      console.log(res);
      this.countList = res.data.data;
      //在渲染 图形
      this.$nextTick(() => {
         this.setOption();
      })
    },

    // 点击搜索
    search() {
      this.getNameList();
      this.getCountList();
    },
  },
  // mounted() {
  //   // 初始化echarts实例
  //   this.chart = echarts.init(document.getElementById("chart"));
  //   // 设置echarts配置项
  //   setTimeout(() => {
  //      console.log("===");
  //     console.log(this.nameList);
  //     console.log(this.countList);
  //     console.log(this.dishIDList);
  //   //   const option = {
  //       this.chart.setOption({
  //       xAxis: {
  //         type: "category",
  //         data: this.nameList,
  //       },
  //       yAxis: {
  //         type: "value",
  //       },
  //       series: [
  //         {
  //           data: this.countList,
  //           type: "bar",
  //         },
  //       ],
  //     });
  //   }, 2000);
  //   // 使用配置项绘制图表
  //   // option && this.chart.setOption(option);
  // },
};
</script>

<style lang="scss" scoped>
.row-box {
  width: 100%;
  display: flex;
  margin-top: 20px;
  margin-bottom: 8px;
  justify-content: center;
}
</style>