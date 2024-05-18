<template>
  <div style="height: auto; width: auto;">

    <!-- 搜素和新增区域 -->
    <el-card>
      <div style="display: flex; flex-direction: row;">
        <!-- 搜索区域 -->
        <el-form :inline="true">
          <el-form-item label="员工姓名">
            <el-input v-model="params.employeeDes" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="员工手机号">
            <el-input v-model="params.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
          <el-form-item label="员工邮箱">
            <el-input v-model="params.email" placeholder="请输入员工邮箱"></el-input>
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
        <el-table-column prop="employeeDes" label="员工姓名" align="center"> </el-table-column>
        <el-table-column prop="sex" label="员工性别" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"> </el-table-column>
        <el-table-column prop="bankcardID" label="银行卡号" align="center"> </el-table-column>
        <el-table-column prop="password" label="密码" align="center"> </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center"> </el-table-column>
        <el-table-column prop="storeName" label="门店" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="员工入职日期" align="center"> </el-table-column>
        <el-table-column prop="endTime" label="员工离职日期" align="center"> </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <!-- <template #default="{ row }">
            {{ row.isResign ? '离职' : '在职' }}
          </template> -->
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button v-if="row.state!='在职'" type="text" size="small" @click="removeEmployee(row.employeeID)">删除</el-button>
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
      <el-form :model="userFormData" class="demo-ruleForm" label-width="80px" status-icon :rules="rules">

        <el-form-item label="员工姓名">
          <el-input v-model="userFormData.employeeDes" placeholder="员工姓名"></el-input>
        </el-form-item>

        <el-form-item label="性别">
                <template>
                    <el-radio v-model="userFormData.sex" label="男">男</el-radio>
                    <el-radio v-model="userFormData.sex" label="女">女</el-radio>
                </template>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="selectedRole" placeholder="选择角色" size="medium" @change="getRoleId">
            <el-option :label="role.roleName" :value="role.roleName" :key="role.roleID" v-for="role in roleList" />
          </el-select>
        </el-form-item>

        <el-form-item label="门店">
          <el-select v-model="selectedStore" placeholder="选择门店" size="medium" @change="getStoreId">
            <el-option :label="store.storeName" :value="store.storeName" :key="store.storeId"
              v-for="store in storeList" />
          </el-select>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="userFormData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userFormData.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="phone" label="手机号" :rules="[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]">
          <el-input v-model="userFormData.phone"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱" :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]">
          <el-input v-model="userFormData.email"></el-input>
        </el-form-item>

        <el-form-item label="银行卡号">
          <el-input v-model="userFormData.bankcardID" placeholder="银行卡号"></el-input>
        </el-form-item>

        <el-form-item label="入职时间">
          <el-date-picker v-model="userFormData.createTime" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
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
    //密码校验
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userFormData.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userFormData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      list: [],
      // 分页相关
      pageno: 1,
      pagesize: 5,
      total: 0,
      // 搜索条件
      params: {
        employeeDes: '',
        phone: '',
        email: '',
      },
      // 控制弹框的显示与隐藏
      dialogFormVisible: false,
      // 表单的数据
      userFormData: {
        employeeID: '',
        employeeDes: '',
        sex: '',
        bankcardID: '',  
        storeName: '',
        password: '',
        checkPass: '',
        phone: '',
        email: '',
        roleName: '',
        createTime: '',
        endTime: '',
        state: '',
        isResign: '',
        accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      },
      //密码校验规则
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      // add： 新增   edit: '更新'
      actionType: '',
      id: '',
      bookID: localStorage.getItem('bookID'),
      //角色(新增/修改区域)
      roleList: [],
      selectedRole: '',
      //门店(新增/修改区域)
      storeList: [],
      selectedStore: ''
    };
  },
  created() {
    this.getList()
    this.getRole()
    this.getStore()
  },

  methods: {
    async getList() {
      const res = await axios({
        method: "get",
        url: "http://localhost:8080/employee/findAllEmployee",
        params: {
          pageno: this.pageno,
          pagesize: this.pagesize,
          ...this.params
        },
      });
      this.list = res.data.data;
      console.log(this.list)
      this.total = res.data.count;
    },
    async getRole() {
      const resRole = await axios({
        method: "get",
        url: "http://localhost:8080/role/findAllRoleName",
      });
      this.roleList = resRole.data.data;
    },
    async getStore() {
      const resStore = await axios({
        method: "get",
        url: "http://localhost:8080/store/findAll",
      });
      this.storeList = resStore.data.data;
    },
    // role监听器：根据角色名称获取角色ID
    getRoleId() {
      const selectedRoleObj = this.roleList.find(role => role.roleName === this.selectedRole);
      if (selectedRoleObj) {
        this.userFormData.roleID = selectedRoleObj.roleID;
      }
      console.log(this.userFormData.roleID)
    },
    // store监听器：根据门店名称获取门店ID
    getStoreId() {
      const selectedStoreObj = this.storeList.find(store => store.storeName === this.selectedStore);
      if (selectedStoreObj) {
        this.userFormData.storeID = selectedStoreObj.storeId;
      }
      console.log(this.userFormData.storeID)
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
        employeeID: '',
        employeeDes: '',
        sex: '',
        roleID: '',
        storeID: '',
        password: '',
        phone: '',
        email: '',
        bankcardID: '',
        createTime: '',
        endTime: '',
        state: '',
        isResign: false,
        accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
      };
      console.log(this.userFormData.roleID)
      console.log(this.userFormData.storeID)
    },

    //修改弹窗
    edit(row) {
      // 打开弹窗
      this.dialogFormVisible = true
      // 数据回显
      this.userFormData.employeeID = row.employeeID
      this.userFormData.employeeDes = row.employeeDes
      this.userFormData.sex = row.sex
      this.userFormData.roleID = row.roleID
      this.userFormData.storeID = row.storeID
      this.userFormData.password = ""
      this.userFormData.phone = row.phone
      this.userFormData.email = row.email
      this.userFormData.bankcardID = row.bankcardID
      this.userFormData.createTime = row.createTime
      this.userFormData.endTime = row.endTime
      this.userFormData.state = row.state
      
      // 记录id
      this.employeeID = row.employeeID
      this.userFormData.isResign = ""
      // 记录动作
      this.actionType = 'edit'
    },

    //新增或修改固定资产
    async submit() {
      // 拷贝userFormData到data
      const data = { ...this.userFormData }
      // 修改的时候需要把id带过去
      if (this.actionType === 'edit') {
        data.employeeID = this.employeeID
        if(data.state === '在职') {
          data.endTime = new Date()
        }
        if(data.state === '离职') {
          data.endTime = ""
        }
        const res = await axios({
          url: 'http://localhost:8080/employee/updateEmployee',
          method: 'post',
          data: data
        })
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          this.$message.error('修改失败');
        }
        this.dialogFormVisible = false
        this.getList()
      } else {
        const res = await axios({
          url: 'http://localhost:8080/employee/insertEmployee',
          method: 'post',
          data: data
        })
        console.log(res.data.code)
        if (res.data.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$message.error('添加失败');
        }
        this.dialogFormVisible = false
        this.getList()
      }
    },
    //删除固定资产
    async removeEmployee(id) {

      const res = await axios({
        url: 'http://localhost:8080/employee/deleteEmployee',
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