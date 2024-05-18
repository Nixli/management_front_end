<template>
  <div style="height: auto; width: auto;">

    <!-- 搜素和新增区域 -->
    <el-card>
      <div style="display: flex; flex-direction: row;">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="params.roleName" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="详情">
            <el-input v-model="params.roleDes" placeholder="请输入详情信息"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>
          <el-button type="primary" @click="addOpen">新增角色信息</el-button>
        </el-form>
      </div>
    </el-card>

    <!-- 员工信息表 -->
    <el-card style="margin-top: 20px;">

      <el-card>
        <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">角色信息</span>
      </el-card>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="roleID" label="角色编号" align="center">  </el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"> </el-table-column>
        <el-table-column prop="roleDes" label="详情信息" align="center"> </el-table-column>
        <!-- <el-table-column prop="isResign" label="状态" align="center">
          <template #default="{ row }">
            {{ row.isResign ? '离职' : '在职' }}
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="{row,$index}">
            <el-button  type="text" size="small"
              @click="open(row.roleID)">删除</el-button>
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
      // 分页相关
      pageno: 1,
      pagesize: 5,
      total: 0,
      // 搜索条件
      params: {
        roleName: '',
        roleDes: ''
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
      bookID: localStorage.getItem('bookID')
    };
  },
  created() {
    this.getList()
  },

  methods: {
    async getList() {
            const res = await axios({
                method: "post",
                url: "http://localhost:8080/role/findAll",
                data: this.params
            }); 
            console.log(res)
            this.list = res.data.data;
          },

    // 点击搜索
    search() {
      this.getList()
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
      this.userFormData = {
        roleName: '',
        roleDes: ''
        // accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      }
    },

    //修改弹窗
    edit(row) {
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
        const res = await axios({
        url: 'http://localhost:8080/role/update',
        method: 'post',
        data: data
      })
      this.dialogFormVisible = false
      this.getList()
      }
      //新增不带id
      else{
        const res = await axios({
        url: 'http://localhost:8080/role/insert',
        method: 'post',
        data: data
      })
      this.dialogFormVisible = false
      this.getList()
      }
      
    },
    //删除
    async removeFixedasset(id) {

      const res = await axios({
        url: 'http://localhost:8080/role/deleteRoleById',
        method: 'post',
        // data一定是个对象，不能直接把id给data，把id变成一个对象给到data
        params: {
          roleID: id
        }
      })
      this.getList()
    },

    open(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.removeFixedasset(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
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