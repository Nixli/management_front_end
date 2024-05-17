<template>
    <div>
      
      <el-container style="width: 600px; float: left;">
        <el-header>
          <h1>菜单</h1>
          <el-input
  <div>

    <el-container>
      <el-header>
        <h1>菜单</h1>
        <el-input
            placeholder="搜索菜品"
            v-model="searchQuery"
            @input="filterDishes"
            clearable
          ></el-input>
        </el-header>
        <el-main>
          <el-row :gutter="20">
            <el-col :span="24" v-for="(category, categoryIndex) in filteredCategories" :key="categoryIndex">
              <el-card class="menu-card">
                <div slot="header" class="clearfix">
                  <span>{{ category.name }}</span>
                </div>
                <el-row :gutter="20">
                  <el-col :span="12" v-for="(dish, dishIndex) in category.dishes" :key="dishIndex">
                    <el-card class="dish-card">
                      <div slot="header">{{ dish.name }}</div>
                      <div>描述：{{ dish.description }}</div>
                      <div class="price">价格: {{ dish.price }}</div>
                      <el-button type="primary" @click="addToCart(dish)">添加到购物车</el-button>
                    </el-card>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <card>
        <el-container v-if="cart.length" class="cart-container" style="width: 400px; float: left;">
        <el-header>
          <h1>购物车</h1>
        </el-header>
        <el-main>
          <el-table :data="cart" style="width: 100%">
            <el-table-column prop="name" label="菜品名称"></el-table-column>
            <el-table-column prop="price" label="价格" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="removeFromCart(scope.$index)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <div>总价: {{ totalPrice }} 
            <el-select style="margin-left: 50px;" v-model="reserveForm.tableNumber" placeholder="请选择桌子号码">
              <el-option
                v-for="table in tableNumbers"
                :key="table"
                :label="table"
                :value="table"
              ></el-option>
            </el-select>
            <el-button style="margin-left: 360px;" type="primary" @click="orderdish(cart,reserveForm.tableNumber)">点餐</el-button></div>
        </el-footer>
      </el-container>
      </card>
      
    </div>
  </template>
  
  <script>


import axios from "axios";

export default {
  data() {
    return {
      dishList:[],
      reserveForm: {
        // ... 其他表单项数据
        tableNumber: '', // 初始时选择一个桌子号码或为空字符串
      },
      tableNumbers: ['1', '2', '3', '4', '5'], // 假设我们有5张桌子，这里列出它们的号码
      categories: [
        {
          name: '川菜',
          dishes: [
            { id: 3,name: '麻辣兔头', description: '川菜经典', price: 45 },
            { id: 4,name: '椒麻鸡', description: '麻辣可口', price: 30 },
            // ... 其他川菜
          ],
        },
        {
          name: '粤菜',
          dishes: [
            { id: 2,name: '清蒸鲈鱼', description: '鲜嫩可口', price: 25 },
            { id: 1,name: '白切鸡', description: '皮脆肉嫩', price: 30 },
            // ... 其他粤菜
          ],
        },
        // ... 添加更多分类
      ],
      cart: [],
      searchQuery: '',
      filteredDishes: [],
      tp:'',
    };
  },
  computed: {
    filteredCategories() {
      // 搜索逻辑与之前保持一致
      return this.categories.map(category => ({
        ...category,
        dishes: category.dishes.filter(dish =>
          dish.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        ),
      }));
    },
    totalPrice() {
      // 计算总价逻辑与之前保持一致
      this.tp=this.cart.reduce((sum, item) => sum + item.price, 0)
      return this.tp;
    },
  },
  created() {
    console.log(localStorage.getItem("employeeID"))
    this.searchDishs();
  },
  methods: {
    open2() {
      this.$message({
        message: '点餐成功',
        type: 'success'
      });
    },
    open1() {
      this.$message({
        message: '该桌已有客人'
      });
    },
    //下单
    async orderdish(cart,table) {
      console.log(cart)
      console.log(table)
      console.log(this.tp)
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/order/download?table="+table+"&tp="+this.tp+"&employeeID="+localStorage.getItem("employeeID"),
        data:cart
      });
      console.log(res.data);
      if(res.data.code==200){
        this.tp='',
          this.cart= [],
          this.reserveForm.tableNumber = '',
          this.open2();
      }else{
        this.open1();
      }
    },
    //添加购物车
    addToCart(dish) {
      this.cart.push(dish);
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    // filterDishes 方法如果需要的话，可以添加防抖或节流逻辑

    reserveTable() {
      // 检查桌子号码是否已输入
      if (this.reserveForm.tableNumber) {
        // 在这里实现安排桌子号码的逻辑
        // 你可以发送一个请求到后端API来安排桌子
        // 或者，如果只是前端演示，你可以简单地打印出信息
        console.log(`桌子号码 ${this.reserveForm.tableNumber} 已安排`);
        // 清空桌子号码输入框
        this.reserveForm.tableNumber = '';
      } else {
        alert('请输入桌子号码！');
      }
    },
    //查询所有菜品
    async searchDishs(){
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/dishes/findAllDishes",
      });
      console.log(res.data.data)
      const ds=res.data.data

    }
  },
};
</script>

<style scoped>
.menu-card {
  margin-bottom: 20px;
}

.dish-card {
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
}

.cart-container {
  margin-top: 20px;
}

.cart-card {
  margin-bottom: 20px;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.float-right {
  float: right;
}
.el-form-item__label {
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 10px;
}
/* 添加更多样式以适应你的需求 */
</style>