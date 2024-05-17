=<template>
  <el-card>
    <div class="container">
      <div class="left" style="margin-top: 20px; height: auto; width: 45%;">
        <el-card>
          <el-header>
            <h1 style="font-size: large; font-weight: bold; margin-bottom: 10px">菜单</h1>
            <el-input style="margin-bottom: 5px;" placeholder="搜索菜品" v-model="searchQuery"  clearable></el-input>
          </el-header>
        </el-card>
        <el-container>

          <el-main>
            <el-row :gutter="20">
              <el-col :span="24" v-for="(category, categoryIndex) in filteredCategories" :key="categoryIndex">
                <el-card class="menu-card">
                  <div slot="header" class="clearfix">
                    <span>{{ category.dishType }}</span>
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="(dish, dishIndex) in category.dishes" :key="dishIndex">
                      <el-card class="dish-card">
                        <div slot="header"><el-image :src="dish.dishImg"></el-image></div>
                        <div>{{ dish.dishesName }}</div>
                        <div>描述：{{ dish.dishesDes }}</div>
                        <div class="price">价格: {{ dish.dishesPrice }}</div>
                        <el-button type="primary" @click="addToCart(dish)">添加菜品</el-button>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </div>

      <div class="right" style="margin-top: 20px; height: auto; width: 45%;">
        <el-card>
          <el-header>
            <h1 style="font-size: large; font-weight: bold; margin-bottom: 10px">店内点餐</h1>
          </el-header>
        </el-card>
        <el-container v-if="cart.length" class="cart-container">
          <el-card class="menu-card">
            <el-main>
              <el-table :data="cart" style="width: 100%">
                <el-table-column prop="dishID" label="菜品ID" v-if="false"></el-table-column>
                <el-table-column prop="dishesName" label="菜品名称"></el-table-column>
                <el-table-column prop="dishesPrice" label="价格" width="180"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="removeFromCart(scope.$index)" type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <div style="font-size: large; font-weight: bold; margin-bottom: 10px">总价: {{ totalPrice }}
                <el-select style="margin-left: 50px;" v-model="reserveForm.tableNumber" placeholder="请选择桌子号码">
                  <el-option v-for="table in tableNumbers" :key="table" :label="table" :value="table"></el-option>
                </el-select>
                <el-button type="primary"
                  @click="orderdish(cart, reserveForm.tableNumber)">点餐</el-button>
              </div>
            </el-footer>
          </el-card>
        </el-container>
      </div>
    </div>
  </el-card>
</template>

<script>


import axios from "axios";

export default {
  data() {
    return {
      store_id: localStorage.getItem('storeID'),
      dishList: [],
      reserveForm: {
        // ... 其他表单项数据
        tableNumber: '', // 初始时选择一个桌子号码或为空字符串
      },
      tableNumbers: ['1', '2', '3', '4', '5'], // 假设我们有5张桌子，这里列出它们的号码
      categories: [
        {
          dishType: '',
          dishes: [
            { 
              store_id: localStorage.getItem('storeID'),
              dishID: 0, 
              dishImg: '', 
              dishesName: '', 
              dishesDes: '', 
              dishesPrice: 0 
            },
          ],
        },
      ],
      cart: [],
      searchQuery: '',
      filteredDishes: [],
      tp: '',
    };
  },
  computed: {
    filteredCategories() {
      // 搜索逻辑与之前保持一致
      return this.categories.map(category => ({
        ...category,
        dishes: category.dishes.filter(dish =>
          dish.dishesName.toLowerCase().includes(this.searchQuery.toLowerCase())
        ),
      }));
    },
    totalPrice() {
      // 计算总价逻辑与之前保持一致
      this.tp = this.cart.reduce((sum, item) => sum + item.dishesPrice, 0)
      return this.tp;
    },
  },
  created() {
    console.log(localStorage.getItem("employeeID"))
    console.log(localStorage.getItem("storeID"))
    // this.searchDishs();
    this.showDishList();
    
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
    //显示菜品
    async showDishList() {
      const res = await axios({
        method: "get",
        url: "http://localhost:8080/dish/findAllByStoreID",
        params: {
          storeID: this.store_id
        },
      });
      this.categories = res.data.data;
      console.log(this.categories)
    },
    //下单
    async orderdish(cart, table) {
      console.log(cart)
      console.log(table)
      console.log(this.tp)
      const dsv=[]
      for (var i = 0;i<cart.length;i++) {
        dsv[i]=cart[i].dishesID
			}
      console.log(dsv)
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/order/download?table=" + table + "&tp=" + this.tp + "&employeeID=" + localStorage.getItem("employeeID")+"&storeID="+localStorage.getItem("storeID"),
        data: dsv
      });
      console.log(res.data);
      if (res.data.code == 200) {
        this.tp = '',
          this.cart = [],
          this.reserveForm.tableNumber = '',
          this.open2();
      } else {
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
    // //查询所有菜品
    // async searchDishs() {
    //   const res = await axios({
    //     method: "post",
    //     url: "http://localhost:8080/dishes/findAllDishes",
    //   });
    //   console.log(res.data.data)
    //   const ds = res.data.data

    // }
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
  color: goldenrod;
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

.container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.left {
  width: 50%;
}

.right {
  width: 40%;

}

/* 添加更多样式以适应你的需求 */
</style>