<template>
  <div class="login-wrapper">
    <div class="login-form">
      <h2 class="login-title">欢迎来到财务管理系统</h2>
      <!-- 表单的容器 -->
      <el-form ref="ruleform" :model="form" :rules="rules">

        <!-- 用户账号 -->
        <el-form-item prop="account">
          <!-- 该表单项的内容 -->
          <el-input suffix-icon="icon-yonghu iconfont" prefix-icon="el-icon-search" placeholder="请输入账号"
            v-model="form.username"></el-input>
        </el-form-item>

        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="form.password">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <!-- 尾部插入图标: -->
            <i slot="suffix" @click="clickEyes" class="iconfont"
              :class="{ 'icon-yanjing': showPwd, 'icon-biyanjing': !showPwd }"></i>
          </el-input>
        </el-form-item>

        <!-- 用户角色 -->
        <el-form-item prop="role">
          <el-select style="width: 100%;" v-model="form.role">
            <el-option label="财务" value="财务"></el-option>
            <el-option label="员工" value="员工"></el-option>
            <el-option label="老板" value="老板"></el-option>
          </el-select>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button @click="submit" style="width: 100%;margin-top: 10px;" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { addRouteByRole } from '@/router'
import { Message } from 'element-ui';
export default {
  data() {
    return {

      // true： 展示密码  眼睛（开）  false： 展示点点点  眼睛（关）
      showPwd: false,

      // 表单的数据
      form: {
        username: '',
        password: '',
        role: '',
      },

      // 表单的规则集: 键名： 你要对表单数据对象下的哪一个属性配置规则, 键名： 真正的规则：数组， 当你只有一个规则的时候，可以就是一个对象
      rules: {
        // 非空校验
        username: { required: true, message: '请输入账号', trigger: 'change' },
        password: { required: true, message: '请输入密码', trigger: 'change' },
        role:{ required: true, message: '请选择角色', trigger: 'change' }
      }

    }
  },

  methods: {
    clickEyes() {
      this.showPwd = !this.showPwd
    },
    // 提交表单 async
    async submit() {

      const LoginResult = await axios({
        method: "post",
        url: "/loginUser",
        data: this.form,
      })
      // 登录成功，把用户的id和用户的角色存放到本地
      if (LoginResult.data.code == 1) {

        localStorage.setItem("employeeID", LoginResult.data.data.employeeID);
        localStorage.setItem("role", LoginResult.data.data.role);

        // 根据角色
        if (this.form.role == '财务') {
          localStorage.setItem('name',LoginResult.data.data.name)
          // 等待两秒后跳转页面
          Message.success('即将进入账套界面')
          setTimeout(() => {
            // 跳转页面
            this.$router.push('/financeAccountBooks');
          }, 2000);
        }else if (this.form.role == '老板') {
          Message.success('即将进入账套界面')
          setTimeout(() => {
            // 跳转页面
            this.$router.push('/financeAccountBooks');
          }, 2000);
        }else {
          localStorage.setItem('bookID', LoginResult.data.data.accountBook.bookID)
          localStorage.setItem('bookName', LoginResult.data.data.accountBook.bookName)
          localStorage.setItem('name',LoginResult.data.data.name)
          Message.success('即将进入员工主界面')
          setTimeout(() => {
            // 跳转页面
            this.$router.push('/personalReimbursement');
          }, 2000);
        }
      } else {
        Message.error('登录失败')
      }
    }
  }

}
</script>


<style lang="scss" scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(245, 245, 245);

  .login-form {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .login-title {
      margin: 20px;
      font-weight: 700;
      font-size: 22px;
      color: black;
    }

    .el-form {
      width: 100%;
    }
  }

  ::v-deep .el-input__inner {
    background-color: #fff;
  }

  ::v-deep .el-input input {
    color: black;
  }

  ::v-deep .el-button--primary {
    color: #FFF;
    background-color:rgb(13, 110, 253);
    border-color: #409EFF;
}
}
</style>