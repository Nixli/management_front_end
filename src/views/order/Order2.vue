<template>
  <div style="height: auto; width: auto;">

    <!-- 搜素和新增区域 -->
    <el-card>
      <div style="display: flex; flex-direction: row;">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <el-form-item label="桌号">
            <el-select v-model="params.tableID" class="filter-item" placeholder="请选择桌子号码">
              <el-option v-for="(tableList, index) in this.tableList" :label="tableList" :value="tableList"></el-option>
            </el-select>
          </el-form-item>

          <el-date-picker style="margin-top: 1px;" v-model="params.times" type="datetimerange" :picker-options="pickerOptions"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>

          <el-form-item label="订单状态" style="margin-left: 10px;">
            <el-select v-model="params.status" class="filter-item" placeholder="请选择状态">
              <el-option v-for="(item, index) in this.options" :key="index" :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>

          <!-- <el-button type="primary" @click="addOpen">新增订单</el-button> -->

        </el-form>
      </div>
    </el-card>

    <!-- 员工信息表 -->
    <el-card style="margin-top: 20px;">

      <el-card>
        <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">订单信息</span>
      </el-card>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="orderID" label="订单编号" align="center"  width="150"> </el-table-column>
        <el-table-column prop="tableID" label="桌子编号" align="center"  width="100"> </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" align="center"> </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="200"> </el-table-column>
        <el-table-column prop="totalPrice" label="总金额" align="center" width="200"> </el-table-column>
        <!-- <el-table-column prop="isResign" label="状态" align="center">
            <template #default="{ row }">
              {{ row.isResign ? '离职' : '在职' }}
            </template>
</el-table-column> -->
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="{row,$index}">
            <el-button :disabled="!row.isResign" type="text" size="small"
              @click="removeFixedasset(row.roleID)">删除</el-button>
            <el-button type="text" style="color: pink;"  size="small" @click="edit(row)">详情</el-button>
            <el-button type="text" size="small" @click="alipay(row)">结账</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="this.total"
        :page-size="params.pagesize" style="text-align: center; margin-top: 10px;">
      </el-pagination>
    </el-card>

    <!-- 弹窗区域 -->
    <el-dialog :title="actionType == 'add' ? '新增角色' : '修改角色'" :visible.sync="dialogFormVisible">
      <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

        <el-form-item label="角色名称">
          <el-input v-model="userFormData.roleName" placeholder="角色名称"></el-input>
        </el-form-item>

        <el-form-item label="详情信息">
          <el-input v-model="userFormData.roleDes" placeholder="详情信息"></el-input>
        </el-form-item>
        <!-- 
          <el-switch v-model="userFormData.isResign" active-text="离职" inactive-text="在职" style="margin-left: 50px;">
          </el-switch> -->

        <el-form-item style="margin-top: 20px;">
          <el-button @click="submit" style="margin-left: 440px;">提交</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";


export default {

  data() {
    return {
      list: [],
      tableList:'',
      options: [
		      {value: '已下单', label: '已下单'},
		      {value: '已结账', label: '已结账' }
 	    ],
      // 分页相关
   
      total: 0,
      // 搜索条件
      params: {
        tableID: undefined,
        status: undefined,
        times: undefined,
        pageno: 1,
        pagesize: 5,
      },
      // 控制弹框的显示与隐藏
      dialogFormVisible: false,
      // 新增表单的数据
      userFormData: {
        roleName: '',
        roleDes: ''
        // isResign:false,
        // accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      },
      // add： 新增   edit: '更新'
      actionType: '',
      roleID: '',
      bookID: localStorage.getItem('bookID'),
      //时间
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
  
    };
  },
  created() {
    console.log(localStorage.getItem("employeeID"))
    this.getTableList(); 
    this.getList()
  },

  methods: {
    open(msg) {
        this.$message({
          message: msg,
          type: 'success'
        });

      },
    alipay(row){
        if(row.status=="已结账"){
          this.open("该订单已支付");
        } 
        else{
          console.log(6)
           this.pay(row)
        }   
      },
    async getTableList() {
      const res = await axios({
        method: "get",
        url: "http://localhost:8080/order/findAllTableId",
        params: {
          
        }
      });
      console.log(res.data.data)
      this.tableList = res.data.data;
    },
    async pay(row) {
      location.href="http://localhost:8080/alipay/sss?totalPrice="+ row.totalPrice+"&orderID="+row.orderID;
      // const res = await axios({
      //   method: "get",
      //   url: "http://localhost:8080/alipay/sss",
      //   params: {
      //     totalPrice: row.totalPrice,
      //     orderID: row.orderID
      //   }
      // });
      //console.log(res)
    },
    async getList() {
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/order/findAll",
        data: this.params
      });
      console.log(res)
      this.list = res.data.data;
      this.total= res.data.count;
    },
    async getDetailList(row){
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/order/findAll",
        params: {
          orderDishID: row.orderDishID,
        }
      });
      console.log(res)
      this.list = res.data.data;
      this.total= res.data.count;
    },

    // 点击搜索
    search() {
      console.log(this.params)
      this.getList()
    },

    // 页码改变
    pagechange(pageno) {
      // 条件改变
      this.params.pageno = pageno
      // 重新请求数据
      this.getList()
    },

    // 打开新增弹窗，
    addOpen() {
      // 等待两秒后跳转页面
            open('即将进入下单界面')
            setTimeout(() => {
                // 跳转页面
                this.$router.push('/order/Order');
            }, 1000);
    },

    //修改弹窗
    edit(row) {
      getDetailList(row)
      // 打开弹窗
      this.dialogFormVisible = true
      console.log(row)
      // 数据回显
      this.userFormData.roleName = row.roleName
      this.userFormData.roleDes = row.roleDes
      // 记录id
      this.roleID = row.roleID
      // 记录动作
      this.actionType = 'edit'
    },

    //新增或修改固定资产
    async submit() {
      // 拷贝userFormData到data
      const data = { ...this.userFormData }
      // 修改的时候需要把id带过去
      if (this.actionType === 'edit') {
        data.roleID = this.roleID
      }
      const res = await axios({
        url: 'http://localhost:8080/role/update',
        method: 'post',
        data: data
      })
      this.dialogFormVisible = false
      this.getList()
    },
    //删除固定资产
    async removeFixedasset(id) {

      const res = await axios({
        url: '/removeEmployee',
        method: 'post',
        // data一定是个对象，不能直接把id给data，把id变成一个对象给到data
        data: {
          employeeID: id
        }
      })
      this.getList()
    },

  },

}
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