<template>
  <div style="height: auto; width: auto;">

    <!-- 搜素和新增区域 -->
    <el-card>
      <div style="display: flex; flex-direction: row;">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <el-form-item label="员工姓名">
            <el-input v-model="params.name" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="员工职位">
            <el-input v-model="params.position" placeholder="请输入员工职位"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
          </el-form-item>
          <el-button type="primary" @click="addOpen">新增员工信息</el-button>
        </el-form>
      </div>
    </el-card>

    <!-- 员工信息表 -->
    <el-card style="margin-top: 20px;">

      <el-card>
        <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">员工信息表</span>
      </el-card>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="name" label="员工姓名" align="center"> </el-table-column>
        <el-table-column prop="age" label="员工年龄" align="center"> </el-table-column>
        <el-table-column prop="sex" label="员工性别" align="center"> </el-table-column>
        <el-table-column prop="position" label="员工职位" align="center"> </el-table-column>
        <el-table-column prop="department" label="员工所属部门" align="center"> </el-table-column>
        <el-table-column prop="hireDate" label="员工入职日期" align="center"> </el-table-column>
        <el-table-column prop="isResign" label="状态" align="center">
          <template #default="{ row }">
            {{ row.isResign ? '离职' : '在职' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button :disabled="!row.isResign" type="text" size="small"
              @click="removeFixedasset(row.employeeID)">删除</el-button>
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
    <el-dialog :title="actionType == 'add' ? '新增员工信息' : '修改员工信息'" :visible.sync="dialogFormVisible">
      <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

        <el-form-item label="员工姓名">
          <el-input v-model="userFormData.name" placeholder="员工姓名"></el-input>
        </el-form-item>

        <el-form-item label="年龄">
          <el-input v-model="userFormData.age" placeholder="年龄"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-input v-model="userFormData.sex" placeholder="性别"></el-input>
        </el-form-item>

        <el-form-item label="员工职位">
          <el-input v-model="userFormData.position" placeholder="员工职位"></el-input>
        </el-form-item>

        <el-form-item label="所属部门">
          <el-input v-model="userFormData.department" placeholder="所属部门"></el-input>
        </el-form-item>

        <el-switch v-model="userFormData.isResign" active-text="离职" inactive-text="在职" style="margin-left: 50px;">
        </el-switch>

        <el-form-item style="margin-top: 20px;">
          <el-button @click="submit">提交</el-button>
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
        name: '',
        position: ''
      },
      // 控制弹框的显示与隐藏
      dialogFormVisible: false,
      // 新增表单的数据
      userFormData: {
        name: '',
        age: '',
        sex: '',
        position: '',
        department: '',
        isResign:false,
        accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      },
      // add： 新增   edit: '更新'
      actionType: '',
      id: '',
      bookID: localStorage.getItem('bookID')
    };
  },
  created() {
    this.getList()
  },

  methods: {
    async getList() {
      const res = await axios({
        method: "get",
        url: "/employee",
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          bookID: this.bookID,
          ...this.params
        },
      });
      this.list = res.data.data.list;
      this.total = res.data.data.total;
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
        name: '',
        age: '',
        sex: '',
        position: '',
        department: '',
        isResign:false,
        accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      }
    },

    //修改弹窗
    edit(row) {
      // 打开弹窗
      this.dialogFormVisible = true
      // 数据回显
      this.userFormData.name = row.name
      this.userFormData.age = row.age
      this.userFormData.sex = row.sex
      this.userFormData.position = row.position
      this.userFormData.department = row.department
      // 记录id
      this.id = row.employeeID
      this.userFormData.isResign = row.isResign
      // 记录动作
      this.actionType = 'edit'
    },

    //新增或修改固定资产
    async submit(id) {
      // 拷贝userFormData到data
      const data = { ...this.userFormData }
      // 修改的时候需要把id带过去
      if (this.actionType === 'edit') {
        data.employeeID = this.id
      }
      const res = await axios({
        url: '/employee',
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