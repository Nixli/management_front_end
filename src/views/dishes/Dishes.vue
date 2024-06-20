<template>
  <div style="height: auto; width: auto;">

    <!-- 搜素和新增区域 -->
    <el-card>
      <div style="display: flex; flex-direction: row;">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <el-form-item label="菜品名称">
            <el-input v-model="params.dishesName" placeholder="请输入菜品名称"></el-input>
          </el-form-item>
          <el-form-item label="门店id">
            <el-input v-model="params.storeId" placeholder="请输入门店id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>
          <el-button type="primary" @click="addOpen">新增菜品信息</el-button>
        </el-form>
      </div>
    </el-card>

    <!-- 员工信息表 -->
    <el-card style="margin-top: 20px;">

      <el-card>
        <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">菜品大类信息表</span>
      </el-card>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="dishesID" label="菜品id" align="center"> </el-table-column>
        <el-table-column prop="dishesName" label="菜品名称" align="center"> </el-table-column>
        <el-table-column prop="dishType" label="菜品大类名称" align="center"> </el-table-column>
        <el-table-column prop="dishesPrice" label="菜品价格" align="center"> </el-table-column>
        <el-table-column prop="dishesDes" label="菜品名称" align="center"> </el-table-column>
        <el-table-column label="菜品图片" align="center"> 
          <template slot-scope="{ row }">
            <div>
              <!-- 始终显示上传按钮 -->
              <el-upload :action="imgUrl + row.dishesID" :show-file-list="true"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                        style="width: 100%; height: 100%;">
                <el-button v-if="!row.dishImg" class="avatar-uploader-trigger" type="primary">上传图片</el-button>
                <!-- 如果存在图片，则显示图片 -->
                <el-image v-if="row.dishImg" :src="row.dishImg"></el-image>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storeid" label="门店id" align="center"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="removeEmployee(row)">删除</el-button>

            <!-- 修改删除按钮操作，以及后续操作 -->

            <el-button type="text" size="small" @click="edit(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
        :page-size="pagesize" style="text-align: center; margin-top: 10px;">
      </el-pagination>
    </el-card>

    <!-- 弹窗区域 -->
    <el-dialog :title="actionType == 'add' ? '新增菜品信息' : '修改菜品信息'" :visible.sync="dialogFormVisible">
      <el-form :model="newDishData" class="demo-ruleForm" label-width="80px">

        <el-form-item label="菜品名称" :rules="[{ required: true, message: '菜品名称不能为空', trigger: 'blur' }]">
          <el-input v-model="newDishData.dishesName" placeholder="菜品名称" ></el-input>
        </el-form-item>

        <el-form-item label="菜品类别" :rules="[{ required: true, message: '菜品类别不能为空', trigger: 'blur' }]">
          <el-input v-model="newDishData.dishType" placeholder="菜品类别" ></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" :rules="[{ required: true, message: '价格不能为空', trigger: 'blur' }]">
          <el-input v-model="newDishData.dishesPrice" placeholder="菜品价格" ></el-input>
        </el-form-item>

        <el-form-item label="菜品描述" >
          <el-input v-model="newDishData.dishesDes" placeholder="菜品描述" ></el-input>
        </el-form-item>

        <el-form-item label="门店编号" :rules="[{ required: true, message: '门店编号不能为空', trigger: 'blur' }]">
          <el-input v-model="newDishData.storeid" placeholder="门店编号" ></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import axios from "axios";

export default {

  data() {
    return {
      list: [],
      // 分页相关
      pageno: 1,
      pagesize: 5,
      total: 0,
      // 搜索条件
      params: {
        dishesName: '',
        storeId: '',
      },
      //图片地址
      imgUrl:"http://localhost:8080/dishes/uploadDishImg?dishesID="
      ,
      // 标志位，用于控制是否需要更新数据
      needUpdate: false,
      // 控制弹框的显示与隐藏
      dialogFormVisible: false,
      // 表单的数据
      newDishData: {
        dishesID:'',
        dishesName:'',
        dishType:'',
        dishesPrice:'',
        dishesDes:'',
        storeid:''
      },
      // add： 新增   edit: '更新'
      actionType: ''
    };
  },
  created() {
    this.getList()
  },

  methods: {
    async getList() {
      const res = await axios({
        method: "get",
        url: "http://localhost:8080/dishes/findAllDishesByPage",
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize
        },
      });
      console.log(res.data.data);
      this.list = res.data.data;
      this.total = res.data.count;
    },
    // 点击搜索
    async search() {
      console.log(this.params)
      const re = await axios({
        method: "get",
        url: "http://localhost:8080/dishes/findAllDishesByDishesNameAndStoreid",
        params: {
          dishType: this.params.dishesName,
          storeId: this.params.storeId
        }
      });
      console.log(re)
      this.list = re.data.data;
      this.total = re.data.count;
    },
    beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 200;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 200MB!');
            }
            return isJPG && isLt2M;
    },
    handleAvatarSuccess(){
      this.getList();
    },
    // 页码改变
    pagechange(pageno) {
      // 条件改变
      this.pageno = pageno
      // 重新请求数据
      this.getList()
    },

    // 打开新增弹窗，
    addOpen() {
      // 打开弹窗
      this.dialogFormVisible = true
      // 记录状态
      this.actionType = 'add'
      // 重置userFormData
      this.newDishData={
        dishesID:'',
        dishesName:'',
        dishType:'',
        dishesPrice:'',
        dishesDes:'',
        storeid:''
      };
    },

    //修改弹窗
    edit(row) {
      console.log(row)
      // 打开弹窗
      this.dialogFormVisible = true
      // 记录动作
      this.actionType = 'edit'
      // 数据回显
      this.newDishData.dishesID = row.dishesID;
      this.newDishData.dishesName = row.dishesName;
      this.newDishData.dishType = row.dishType;
      this.newDishData.dishesPrice = row.dishesPrice;
      this.newDishData.dishesDes = row.dishesDes;
      this.newDishData.storeid = row.storeid;
    },

    //新增或修改菜品大类
    async submit() {
      this.dialogFormVisible = false;
      if(this.actionType == 'edit'){
        console.log(this.newDishData);
        const res = await axios({
                url: "http://localhost:8080/dishes/updateDishes",
                method: 'post',
                data: this.newDishData
            }).then(result => {
          console.log(result);
          if (result.data.code == 200) {
            alert(result.data.msg);
            
            this.getList();
          } else {
            alert(result.data.msg);
          }
        });
      }
      if(this.actionType == 'add'){
        console.log(this.newDishData);
        const res = await axios({
                url: "http://localhost:8080/dishes/insertDishes",
                method: 'post',
                data: this.newDishData
            }).then(result => {
          console.log(result.data);
          if (result.data.code == 200) {
            alert(result.data.msg);
            this.getList();
          } else {
            alert(result.data.msg);
          }
        });
      }
    },
    //删除菜品大类
    async removeEmployee(row) {
        console.log(row.dishesID);
      const res = await axios({
        url: 'http://localhost:8080/dishes/deleteDishes',
        method: 'post',
        // data一定是个对象，不能直接把id给data，把id变成一个对象给到data
        data: {
          dishesID: row.dishesID
        }
      }).then(result => {
        alert(result.data.msg);
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